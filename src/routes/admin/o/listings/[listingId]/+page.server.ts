import { type ServerLoadEvent, redirect, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail as formFail, setError } from 'sveltekit-superforms';
import { editSchema } from './editListing';
import type { ListingModel } from '../../../../../app';
import { pb } from '$lib/database';

export const load = async (event: ServerLoadEvent) => {
  const { cookies, locals, params } = event;

  let userType = locals?.user?.accountType;
  if (userType !== 'organizationAdmin') {
    return fail(401, { message: 'Unauthorized' });
  }

  const listingId = params.listingId;
  if (!listingId) {
    throw fail(400, { message: 'Listing ID is required' });
  }

  const listing = await locals.pb.collection('listings').getOne(listingId);

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

    console.log("successfully deleted");

    await locals.pb.collection('listings').delete(listingId);

    return {
      message: "Done!"
    }
  }
};