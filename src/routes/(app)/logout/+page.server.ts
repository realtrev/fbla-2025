import { ServerLoadEvent, redirect } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals } = event;

	cookies.delete('pb_auth', { path: '/', sameSite: 'strict', secure: false, httpOnly: false });
  locals.pb.authStore.clear();

	// Sync current user state with Svelte store
	// $currentUser.set(pb.authStore.record);

  return redirect(303, '/login');
}