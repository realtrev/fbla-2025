import { Actions } from '@sveltejs/kit';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/pocketbase';

export const actions: Actions = {
	login: async ({ locals, request }) => {
    console.log('login', request.body);

    try {
      const data = await RequestParser.parse(request);
      console.log('data', data);

      const formData = new FormData();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const record = await pb.collection('files').create(formData);


    } catch (error) {
      console.error(error);
    }

    return {
      status: 200,
      body: {
        message: 'Login success'
      }
    }
  }
};