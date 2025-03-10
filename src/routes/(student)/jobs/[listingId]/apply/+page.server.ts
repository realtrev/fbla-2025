import { type ServerLoadEvent, redirect, fail, error, type Actions } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate, fail as formFail, setError } from 'sveltekit-superforms';
import { applicationSchema } from './applicationForm';
import type { ListingModel } from '../../../../../app';
import { pb } from '$lib/database';
import { BinarySize } from '$lib/utils';

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

  const listing = await locals.pb.collection('listings').getOne(listingId, {
    expand: "organization"
  })
  .catch(() => false) as ListingModel;

  if (!listing) {
    error(404, {
      message: "Not found."
    });
  }

  const currentOrg = listing.expand ? listing.expand.organization : null;

  return {
    listing: listing,
    organization: currentOrg,
    form: await superValidate(zod(applicationSchema)),
  };
}

export const actions: Actions = {
  default: async (event) => {
    const { locals, request, params } = event;

    let userType = locals?.user?.accountType;
    if (userType !== 'student') {
      error(401, { message: 'Unauthorized' });
    }

    const formData = await request.formData();
    const form = await superValidate(formData, zod(applicationSchema));

    if (!form.valid) {
      return formFail(400, {
        form,
      });
    }

    const resume = formData.get("resume");
    // check that size is less than 512KB
    if (resume instanceof File && resume.size > BinarySize.fromMegabytes(5).bytes) {
      setError(form, "resume", "Resume must be less than 5MB");
      return formFail(400, {
        form,
      });
    }
    const message = formData.get("message");

    const listingId = params.listingId;
    if (!listingId) {
      return formFail(400, {
        message: 'Listing ID is required',
        form,
      });
    }

    let record;
    try {
      record = await pb.collection('applications').create({
        listing: listingId,
        student: locals?.user?.id,
        attachedMessage: form.data.message,
        resume: resume,
        status: 'submitted',
      })
        .then((r: ListingModel) => r);
    } catch (e) {
      console.error(e);
      return formFail(400, {
        message: 'Failed to send application.',
        form,
      });
    }

    return {
      form,
      record
    }
  },
};