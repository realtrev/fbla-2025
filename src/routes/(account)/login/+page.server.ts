import { type Actions, redirect } from '@sveltejs/kit';

import { CF_CAPTCHA_SECRET } from '$env/static/private';
import { message, superValidate, fail, setError } from 'sveltekit-superforms';
import { validateToken } from '$lib/utils';

import { schema, type FormSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
  const form = await superValidate(zod(schema), { errors: true });
  return { form };
}

export const actions: Actions = {
	default: async (event) => {
    const { locals, request, cookies, body } = event;

    // Get the raw form data
    const formData = await request.formData();

    // Access the Turnstile token
    const turnstileToken = formData.get('cf-turnstile-response');

    const form = await superValidate(formData, zod(schema));
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

    console.log("success");
    const { email, password } = form.data;

    try {
      await locals.pb.collection('users').authWithPassword(email, password);
      // get between = and first ;
      // e
      if (locals.pb.authStore.baseModel?.accountType !== 'student') {
        return message(form, 'Invalid account type', {
          status: 400
        });
      }
      const cookie = locals.pb.authStore.exportToCookie({ httpOnly: false, secure: false });
      const cookieValue = cookie.split('=')[1].split(';')[0];
      cookies.set('pb_auth', decodeURIComponent(cookieValue), {
        httpOnly: false,
        secure: false,
        path: '/',
      });
    } catch (error) {
      return message(form, 'Invalid login credentials', {
        status: 400
      });
    }

    console.log("success");
    return redirect(303, '/dashboard');
  }
};