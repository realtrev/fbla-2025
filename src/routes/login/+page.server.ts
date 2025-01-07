import { Actions, json, fail } from '@sveltejs/kit';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/pocketbase';

import { HCAPTCHA_SECRET } from '$env/static/private';

export const actions: Actions = {
	login: async ({ locals, request }) => {
    console.log('request', request.body);
    
    try {
      const data = await RequestParser.parse(request, HCAPTCHA_SECRET)
      
      const { email, password } = data;

      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log('authData', authData);

    } catch (error) {
      console.error(error);

      return fail(400, { message: error.message });
    }

    return { redirect: '/dashboard' };
  }
};