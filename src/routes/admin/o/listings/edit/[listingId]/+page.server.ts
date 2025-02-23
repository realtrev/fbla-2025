import { type ServerLoadEvent, redirect, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail as formFail, setError } from 'sveltekit-superforms';
import { editSchema } from './editListing';

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

  return {
    listing: locals.pb.collection('listings').getOne(listingId),
    form: await superValidate(zod(editSchema))
  };
}

export const actions: Actions = {
  saveListing: async (event) => {
    const { locals, request, params, body } = event;

    const formData = await request.formData();
    const form = await superValidate(formData, zod(editSchema));

    if (!form.valid) {
      return formFail(400, {
        form,
      });
    }

    const listingId = params.listingId;
    if (!listingId) {
      throw fail(400, { message: 'Listing ID is required' });
    }

    const record = await locals.pb.collection('listings').update(listingId, {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type")
    })
      .then((r) => {console.log(r); return true;})
      .catch(e => false);

    if (record === false) {
      throw fail(400, { message: 'Failed to save listing.' });
    }

    return {
      form
    }
  },
  deleteListing: async (event) => {
    const { locals, request, params } = event;

    const listingId = params.listingId;
    if (!listingId) {
      throw fail(400, { message: 'Listing ID is required' });
    }

    console.log("successfully deleted");

    await locals.pb.collection('listings').delete(listingId);

    return {
      message: "Done!"
    }
  }
};