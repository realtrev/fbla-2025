import { type ServerLoadEvent, redirect } from '@sveltejs/kit';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals } = event;

  let userType = locals.pb.authStore.baseModel?.accountType;

	cookies.delete('pb_auth', { path: '/', sameSite: 'strict', secure: false, httpOnly: false });
  locals.pb.authStore.clear();

  if (userType === 'schoolAdmin') {
    return redirect(303, '/login/school');
  }
  if (userType === 'organizationAdmin') {
    return redirect(303, '/login/organization');
  }
  return redirect(303, '/login');
}