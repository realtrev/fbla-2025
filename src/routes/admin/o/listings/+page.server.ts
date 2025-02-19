import type { PageServerLoad } from './$types';
import { pb } from '$lib/database';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  // if user is authenticated
  if (!locals.pb.authStore.isValid || !locals.user || locals.user.accountType !== "organizationAdmin") {
    return fail(301, {message: "You can't do that."});
  }

	return {
    listings: locals.pb.collection('listings').getList(1, 50, {}) as ListingModel[]
	};
};