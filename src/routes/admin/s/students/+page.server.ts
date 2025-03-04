import { fail, type ServerLoadEvent } from '@sveltejs/kit';
import { pb } from '$lib/database';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, request, params } = event;

  return {
		students: await pb.collection('users').getFullList({
			filter: `school = '${locals.school?.id}' && accountType = 'student'`,
		}),
  }
}