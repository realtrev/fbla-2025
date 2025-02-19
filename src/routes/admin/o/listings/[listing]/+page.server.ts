import type { PageServerLoad } from './$types';
import { pb } from '$lib/database';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  // if user is authenticated
  if (!locals.pb.authStore.isValid || !locals.user || !locals.user.accountType === "organizationAdmin") {
    return fail(301, {message: "You can't do that."});
  }

  console.log(params.listing);
	return {
    listing: locals.pb.collection('listings').getOne(params.listing) as ListingModel
	};
};