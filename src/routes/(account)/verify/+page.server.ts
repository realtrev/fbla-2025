import { type Actions, json, fail, redirect } from '@sveltejs/kit';
import { CF_CAPTCHA_SECRET } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { pb } from '$lib/database';
import { validateToken } from '$lib/utils';

export const actions: Actions = {
  resendEmailVerification: async (event) => {
    const { locals, request, cookies, body } = event;

    // Get the raw form data
    const formData = await request.formData();

    // Access the Turnstile token
    const turnstileToken = formData.get('cf-turnstile-response');

    if (!await validateToken(turnstileToken, CF_CAPTCHA_SECRET)) {
      return fail(400, { message: 'Failed to verify CAPTCHA' });
    }

    const email = locals.user.email;
    await pb.collection('users').requestVerification(email).then((response) => {
      console.log(response);
    })
    .catch((error) => {
      return fail(500, { message: error.message });
    });

    return { message: 'Verification email sent.' };
  },
};