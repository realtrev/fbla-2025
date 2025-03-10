import { pb } from '$lib/pocketbase';
import { error, fail, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request, params } = event;

	let userType = locals?.user?.accountType;
	if (userType !== 'organizationAdmin') {
		error(401, { message: 'Unauthorized' });
	}

	const authCookie = request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(authCookie);

  return {
		applications: await pb.collection('applications').getFullList({
			expand: 'listing,student',
		}),
  }
}