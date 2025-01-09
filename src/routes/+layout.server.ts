import { pb } from '$lib/pocketbase';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request } = event;

	const authCookie = request.headers.get('cookie') ?? '';
	pb.authStore.loadFromCookie(authCookie);

  return {
    user: pb.authStore.record,
  }
}