import { pb } from '$lib/pocketbase';
import { fail, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request, params } = event;

	const authCookie = request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(authCookie);

  return {
		applications: await locals.pb.collection('applications').getFullList({
			expand: 'listing,student',
		}),
  }
}