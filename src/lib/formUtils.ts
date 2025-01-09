import * as devalue from 'devalue';

export class FormUtils {
  static async submitForm(url: string, data: Object | FormData, trackProgress: (progress: number) => void = () => {}): Promise<{
    type: string;
    status: number;
    data: any[];
    location?: string;
  }> {
    if (url.startsWith('?')) {
      const currentUrl = new URL(window.location.href);
      const relativePath = url.slice(1);
      url = new URL(relativePath, currentUrl.href).toString();
    }

    const isFormData = data instanceof FormData;

    if (isFormData && trackProgress) {
      return await this.#submitFormWithProgress(url, data, trackProgress);
    }

    // convert to FormData if data is an object
    if (!isFormData) {
      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
      data = formData;
    }

    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form: ${response.statusText}`);
    }

    const body = await response.json();

    return {
      ...body,
      data: body.data ? devalue.unflatten(JSON.parse(body.data)) : {},
    }
  }

  static async #submitFormWithProgress(url: string, formData: FormData, trackProgress: (progress: number) => void): Promise<Response> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          trackProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(xhr.statusText));
        }
      };

      xhr.onerror = () => {
        reject(new Error('An error occurred whilst submitting the form'));
      };
      xhr.send(formData);
    });
  }
}

export class RequestParser {
  static async parse(request: Request, captchaSecret: string = null): Promise<Object> {
    const contentType = request.headers.get('content-type');
    
    if (contentType.includes('multipart/form-data')) {
      return await this.#parseFormData(request, captchaSecret);
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      if (captchaSecret) {
        if (!body.token) {
          throw new Error('No token provided');
        }
        const valid = await this.verifyCaptcha(body.token, captchaSecret);
        if (!valid) {
          throw new Error('Invalid token');
        }
        return body;
      }

      return body;
    } else {
      return await this.#parseStream(request);
    }
  }

  static async #parseFormData(request: Request, captchaSecret: string = null): Promise<Object> {
    const formData = await request.formData();
    const result = {};

    // check if formData includes a token
    if (captchaSecret) {
      const token = formData.get('token');
      if (!token) {
        throw new Error('No token provided');
      }
      const valid = await this.verifyCaptcha(token, captchaSecret);
      if (!valid) {
        throw new Error('Invalid token');
      }
    }

    for (const [key, value] of formData.entries()) {
      // Check for files
      if (value instanceof File) {
        result[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
          stream: value.stream(),
        };
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  static async #parseStream(request: Request): Promise<string> {
    const bodyStream = request.body;
    let body = '';

    for await (const chunk of bodyStream) {
      body += chunk.toString();
    }

    return body;
  }

  static async handleUpload(stream: ReadableStream, onProgress: (bytesUploaded: number, totalSize: number) => void, totalSize: number): Promise<Buffer> {
    let uploadedSize = 0;
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
      uploadedSize += chunk.length;

      if (onProgress) {
        onProgress(uploadedSize, totalSize);
      }
    }

    return Buffer.concat(chunks);
  }

  static async verifyCaptcha(token: string, captchaSecret: string): Promise<boolean> {
    const valid = await fetch('https://hcaptcha.com/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `response=${token}&secret=${captchaSecret}`
		}).then((r) => r.json());
    return valid.success;
  }
}