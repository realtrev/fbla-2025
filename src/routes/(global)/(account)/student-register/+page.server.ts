import { Actions, json, fail, redirect } from '@sveltejs/kit';
import { POCKETBASE_AUTH_KEY } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/database';

export const actions: Actions = {
  checkEmail: async ({ request }) => {
    const data = await RequestParser.parse(request);
    const { email } = data;
    console.log(email);

    // get the email domain
    const domain = email.split('@')[1];
    console.log(domain);

    const school = await pb.collection('schools').getFirstListItem(`emailDomain = "${domain}"`)
    .catch((error) => {
      return fail(500, { message: error.message });
    });

    if (school.status === 500) {
      return fail(400, { emailMessage: 'School email domain not recognized. Check that your school is partnered with us.'});
    }

    return { school: {
      name: school.name,
      website: school.website,
      emailDomain: school.emailDomain,
      logo: `${PUBLIC_POCKETBASE_URL}/api/files/${school.collectionId}/${school.id}/${school.logo}`
    }};
  }
};