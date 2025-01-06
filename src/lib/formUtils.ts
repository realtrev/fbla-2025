export class FormUtils {
  static async submitForm(url: string, data: Object | FormData, trackProgress: (progress: number) => void = () => {}): Promise<Response> {
    if (url.startsWith('?')) {
      const currentUrl = new URL(window.location.href);
      const relativePath = url.slice(1);
      url = new URL(relativePath, currentUrl.href).toString();
    }

    const isFormData = data instanceof FormData;

    if (isFormData && trackProgress) {
      return this.#submitFormWithProgress(url, data as FormData, trackProgress);
    }

    return fetch(url, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
      },
    });
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
          reject(xhr.statusText);
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
  static async parse(request: Request): Promise<Object> {
    const contentType = request.headers.get('content-type');

    if (contentType.includes('multipart/form-data')) {
      return await this.#parseFormData(request);
    } else if (contentType.includes('application/json')) {
      return await request.json();
    } else {
      return await this.#parseStream(request);
    }
  }

  static async #parseFormData(request: Request): Promise<Object> {
    const formData = await request.formData();
    const result = {};

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
}