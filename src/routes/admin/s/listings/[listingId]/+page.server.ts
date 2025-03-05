import { type ServerLoadEvent, redirect, fail, error } from '@sveltejs/kit';
import type { ListingModel } from '../../../../../app';
import { pb } from '$lib/database';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, params } = event;

  let userType = locals?.user?.accountType;
  if (userType !== 'schoolAdmin') {
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
  approveListing: async (event) => {
    const { locals, request, params } = event;

    let userType = locals?.user?.accountType;
    if (userType !== 'schoolAdmin') {
      error(401, { message: 'Unauthorized' });
    }

    const formData = await request.formData();

    const schoolId = locals.school?.id;
    const removeListing = formData.get("remove") ?? false;
    console.log("asdasd", formData);
    if (!schoolId) {
      return fail(400, { message: 'School ID is required' });
    }

    const listingId = params.listingId;
    if (!listingId) {
      return fail(400, { message: 'Listing ID is required' });
    }

    const listing = await locals.pb.collection('listings').getOne(listingId, {
      expand: 'organization',
    })
      .catch(() => false);

    if (!listing || !listing?.expand?.organization?.partnerSchools?.includes(schoolId)) {
      return fail(400, { message: 'Couldn\'t approve that listing'});
    }

    if (listing.confirmedSchools.includes(schoolId) && !removeListing) {
      return fail(400, { message: 'Couldn\'t approve that school. Already approved'});
    }

    if (!listing.requestedSchools.includes(schoolId) && !removeListing) {
      return fail(400, { message: 'Couldn\'t approve that school. Not requested'});
    }

    if (removeListing) {
      listing.requestedSchools = listing.requestedSchools.filter((id: string) => id !== schoolId);
      listing.confirmedSchools = listing.confirmedSchools.filter((id: string) => id !== schoolId);
    } else {
      listing.confirmedSchools.push(schoolId);
    }
    
    await pb.collection('listings').update(listingId, {
      requestedSchools: listing.requestedSchools,
      confirmedSchools: listing.confirmedSchools,
    });

    return {
      message: "Done!",
      requestedSchools: listing.requestedSchools,
      confirmedSchools: listing.confirmedSchools,
    }
  },
};