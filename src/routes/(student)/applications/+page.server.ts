import { pb } from '$lib/pocketbase';
import { error, fail, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request, params } = event;

	const authCookie = request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(authCookie);

	let userType = locals?.user?.accountType;
	if (userType !== 'student') {
		error(401, { message: 'Unauthorized' });
	}

  return {
		applications: await locals.pb.collection('applications').getFullList({
			expand: 'listing,student,listing.organization',
		}),
  }
}