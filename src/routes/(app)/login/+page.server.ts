import { Actions, json, fail, redirect } from '@sveltejs/kit';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/pocketbase';

import { HCAPTCHA_SECRET } from '$env/static/private';

export const actions: Actions = {
	login: async ({ locals, request, cookies }) => {
    console.log('request', request.body);
    
    try {
      const data = await RequestParser.parse(request, HCAPTCHA_SECRET)
      
      const { email, password } = data;

      try {
        await locals.pb.collection('users').authWithPassword(email, password);
        // get between = and first ;
        const cookie = locals.pb.authStore.exportToCookie({ httpOnly: false, secure: false });
        const cookieValue = cookie.split('=')[1].split(';')[0];
        cookies.set('pb_auth', decodeURIComponent(cookieValue), {
          httpOnly: false,
          secure: false,
          path: '/',
        });
      } catch (error) {
        return fail(400, { message: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error(error);

      return fail(400, { message: error.message });
    }

    return redirect(303, '/app');
  }
};