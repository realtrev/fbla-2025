import { pb } from '$lib/pocketbase';
import { fail, type ServerLoadEvent } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request, params } = event;

	const authCookie = request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(authCookie);

	// get tab from url - listings?drafts
	const tab = params.tab || 'all';

  return {
		listings: await pb.collection('listings').getFullList(),
  }
}