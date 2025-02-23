import { type ServerLoadEvent, redirect } from '@sveltejs/kit';
import { pb } from '$lib/database';

export const load = async ({ cookies, locals }) => {
  let userType = locals.pb.authStore.baseModel?.accountType;
  if (userType !== 'organizationAdmin') {
    return redirect(303, '/');
  }

  const value = await pb.collection('listings').create({
    "title": "New Job Listing",
    "description": "New job description.",
    "organization": locals.user?.organization ?? "",
    "location": "test",
    "type": "full-time",
    "applicationDeadline": "2022-01-01 10:00:00.123Z",
    "applicationLimit": 0,
    "published": false
  });

  console.log(value);

  return redirect(303, '/admin/o/listings/edit/' + value.id);
}