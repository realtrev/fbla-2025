import { type Actions, redirect } from '@sveltejs/kit';
import { CF_CAPTCHA_SECRET } from '$env/static/private';
import { message, superValidate, fail, setError } from 'sveltekit-superforms';
import { validateToken } from '$lib/utils';
import { emailOnly } from './emailOnly';
import { zod } from 'sveltekit-superforms/adapters';
import { pb } from '$lib/database';

export const load = async () => {
  const emailOnlyClientForm = await superValidate(zod(emailOnly));

  return { emailOnlyForm: emailOnlyClientForm };
}

export const actions: Actions = {
  resetPassword: async (event) => {
    const { locals, request, cookies, body } = event;

    // Get the raw form data
    const formData = await request.formData();

    // Access the Turnstile token
    const turnstileToken = formData.get('cf-turnstile-response');

    const form = await superValidate(formData, zod(emailOnly));
    if (!await validateToken(turnstileToken, CF_CAPTCHA_SECRET)) {
      return message(form, 'Failed to verify CAPTCHA', {
        status: 400
      });
    }

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { email } = form.data;
    const result = await pb.collection('users').requestPasswordReset(email);

    return {
      form
    }
  },
};