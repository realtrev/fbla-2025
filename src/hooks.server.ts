import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { allowRouteAccess } from '$lib/protection';
import { pb } from '$lib/database';

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies, locals, request } = event;

  locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);
  locals.pb.authStore.loadFromCookie(request.headers.get('cookie') ?? '');

  // if user is logged in, refresh token
	if (locals.pb.authStore.isValid) {
    try {
      // refresh token
			await locals.pb.collection('users').authRefresh();

      const cookie = locals.pb.authStore.exportToCookie({ httpOnly: false, secure: false });

      // create new cookie with new token
      const cookieValue = cookie.split('=')[1].split(';')[0];
      cookies.set('pb_auth', decodeURIComponent(cookieValue), {
        httpOnly: false,
        secure: false,
        path: '/',
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
		} catch (e) {
      // if refresh token fails, clear auth store and cookie
			locals.pb.authStore.clear();
      cookies.delete('pb_auth', { path: '/', sameSite: 'strict', httpOnly: false });
		}
	} else {
    // if user is not logged in, clear auth store and cookie
    locals.pb.authStore.clear();
    cookies.delete('pb_auth', { path: '/' , sameSite: 'strict', httpOnly: false });
  }

	locals.user = locals.pb.authStore.record;

  if (locals.user && locals.user.verified === false) {
    if (event.url.pathname !== '/verify') {
      throw redirect(303, '/verify');
    }
  }

  if (locals.user && locals.user.verified === true && event.url.pathname === '/verify') {
    if (locals.user?.accountType === 'student') {
      throw redirect(303, '/dashboard');
    } else if (locals.user?.accountType === 'organizationAdmin') {
      throw redirect(303, '/admin/o/dashboard');
    } else {
      throw redirect(303, '/admin/s/dashboard');
    }
  }

  // check if url pathname is in guest or auth only routes
  // for example: /app is auth only and will otherwise redirect to /login
  const targetUrl = new URL(event.url);
  const destRoute = allowRouteAccess(targetUrl.pathname, locals.pb.authStore.isValid, locals.pb.authStore.baseModel?.accountType ?? null);

  if (destRoute !== targetUrl.pathname) {
    throw redirect(303, destRoute);
  }

  if (locals.user?.school) {
    try {
      locals.school = await locals.pb.collection('schools').getOne(locals.user?.school);
    } catch(e) {
      console.log("School not received");
    }
  }

  if (locals.user?.organization) {
    try {
      locals.organization = await locals.pb.collection('organizations').getOne(locals.user?.organization);
    } catch(e) {
      console.log("Organization not received");
    }
  }

	const response = await resolve(event);

  return response;
};
