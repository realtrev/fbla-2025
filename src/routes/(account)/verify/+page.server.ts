import { type Actions, json, fail, redirect } from '@sveltejs/kit';
import { HCAPTCHA_SECRET } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/database';

export const actions: Actions = {
  resendVerificationEmail: async ({ request }) => {
    const data = await RequestParser.parse(request);
    const { email } = data;

    await pb.collection('users').requestVerification(email).then((response) => {
      console.log(response);
    })
    .catch((error) => {
      return fail(500, { message: error.message });
    });

    return { message: 'Verification email sent.' };
  },
};