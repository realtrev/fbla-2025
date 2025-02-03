import { Actions, json, fail, redirect } from '@sveltejs/kit';
import { HCAPTCHA_SECRET } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { RequestParser } from '$lib/formUtils';
import { pb } from '$lib/database';

export const actions: Actions = {
  checkEmail: async ({ request }) => {
    const data = await RequestParser.parse(request);
    const { email } = data;

    // get the email domain
    const domain = email.split('@')[1];

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
      id: school.id,
      logo: `${PUBLIC_POCKETBASE_URL}/api/files/${school.collectionId}/${school.id}/${school.logo}`
    }};
  },

  register: async ({ locals, request, cookies }) => {
    const data = await RequestParser.parse(request, HCAPTCHA_SECRET);
    const { email, password, schoolId, firstName, lastName } = data;

    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      school: schoolId,
      firstName,
      lastName,
      accountType: 'student',
    })
    .catch((error) => {
      console.log(error.response?.data?.email);
      if (error.response?.data?.email) {
        return fail(500, { message: "Email address already in use" });
      }
      return fail(500, { message: "Failed to create your account. Try again later" });
    });
    console.log(user);

    if (user.status === 500) {
      return fail(400, { message: "Failed to create your account." });
    }

    await pb.collection('users').requestVerification(email)
    .catch((error) => {
      return fail(500, { message: error.message });
    });

    // try logging in
    await locals.pb.collection('users').authWithPassword(email, password);
    // get between = and first ;
    const cookie = locals.pb.authStore.exportToCookie({ httpOnly: false, secure: false });
    const cookieValue = cookie.split('=')[1].split(';')[0];
    cookies.set('pb_auth', decodeURIComponent(cookieValue), {
      httpOnly: false,
      secure: false,
      path: '/',
    });

    return redirect(303, '/app');
  }
};