import { type ServerLoadEvent, redirect, fail, error } from '@sveltejs/kit';
import type { ListingModel } from '../../../../../app';
import { pb } from '$lib/database';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, params } = event;

  let userType = locals?.user?.accountType;
  if (userType !== 'student') {
    error(401, { message: 'Unauthorized' });
  }

  const listingId = params.listingId;
  if (!listingId) {
    error(400, { message: 'Listing ID is required' });
  }

  const listing = await locals.pb.collection('listings').getOne(listingId)
  .catch(() => false) as ListingModel;

  if (!listing) {
    error(404, {
      message: "Not found."
    });
  }

  const currentOrg = await pb.collection('organizations').getOne(listing.organization);

  return {
    listing: listing,
    organization: currentOrg,
  };
}

export const actions: Actions = {
};