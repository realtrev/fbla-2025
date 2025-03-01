import { type ServerLoadEvent, redirect, fail, error } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail as formFail, setError } from 'sveltekit-superforms';
import { editSchema } from './editListing';
import type { ListingModel } from '../../../../../app';
import { pb } from '$lib/database';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, params } = event;

  let userType = locals?.user?.accountType;
  if (userType !== 'organizationAdmin') {
    error(401, { message: 'Unauthorized' });
  }

  const listingId = params.listingId;
  if (!listingId) {
    error(400, { message: 'Listing ID is required' });
  }

  const listing = await locals.pb.collection('listings').getOne(listingId)
  .catch(() => false);

  if (!listing) {
    error(404, {
      message: "Not found."
    });
  }

  const organizationId = locals.user?.organization;
  const currentOrg = await pb.collection('organizations').getOne(organizationId, {
    expand: "partnerSchools"
  });

  return {
    listing: listing,
    organization: currentOrg,
    form: await superValidate(zod(editSchema)),
    availableSchools: currentOrg.expand?.partnerSchools ?? []
  };
}

export const actions: Actions = {
  saveListing: async (event) => {
    const { locals, request, params, body } = event;

    console.log("saving");

    const formData = await request.formData();
    const form = await superValidate(formData, zod(editSchema));

    if (!form.valid) {
      return formFail(400, {
        form,
      });
    }

    const listingId = params.listingId;
    if (!listingId) {
      return formFail(400, {
        message: 'Listing ID is required',
        form,
      });
    }

    let record;
    try {
      record = await locals.pb.collection('listings').update(listingId, {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        location: formData.get("location"),
        thumbnail: formData.get("thumbnail"),
      })
        .then((r: ListingModel) => r);
    } catch (e) {
      console.error(e);
      return formFail(400, {
        message: 'Failed to save listing.',
        form,
      });
    }

    return {
      form,
      record
    }
  },
  deleteListing: async (event) => {
    const { locals, request, params } = event;

    const listingId = params.listingId;
    if (!listingId) {
      return fail(400, { message: 'Listing ID is required' });
    }

    await locals.pb.collection('listings').delete(listingId);

    return {
      message: "Done!"
    }
  },
  publishListing: async (event) => {
    const { locals, request, params } = event;

    const listingId = params.listingId;
    if (!listingId) {
      return fail(400, { message: 'Listing ID is required' });
    }

    await pb.collection('listings').update(listingId, {
      published: true
    });

    return {
      message: "Done!"
    }
  },
  requestSchool: async (event) => {
    const { locals, request, params } = event;

    const formData = await request.formData();

    const schoolId = formData.get("school");
    const cancelRequest = formData.get("cancelRequest") ?? false;
    if (!schoolId) {
      return fail(400, { message: 'School ID is required' });
    }

    const listingId = params.listingId;
    if (!listingId) {
      return fail(400, { message: 'Listing ID is required' });
    }

    const listing = await locals.pb.collection('listings').getOne(listingId)
      .catch(() => false);

    if (!listing || !locals.organization?.partnerSchools?.includes(schoolId)) {
      return fail(400, { message: 'Couldn\'t request that school'});
    }

    if (listing.confirmedSchools.includes(schoolId) && !cancelRequest) {
      return fail(400, { message: 'Couldn\'t request that school. Already accepted'});
    }

    if (listing.requestedSchools.includes(schoolId) && !cancelRequest) {
      return fail(400, { message: 'Couldn\'t request that school. Already requested'});
    }

    if (cancelRequest) {
      listing.requestedSchools = listing.requestedSchools.filter((id) => id !== schoolId);
      listing.confirmedSchools = listing.confirmedSchools.filter((id) => id !== schoolId);
    } else {
      listing.requestedSchools.push(schoolId);
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