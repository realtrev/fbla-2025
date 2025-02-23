import { type Actions, redirect } from '@sveltejs/kit';
import { CF_CAPTCHA_SECRET } from '$env/static/private';
import { message, superValidate, fail, setError } from 'sveltekit-superforms';
import { validateToken } from '$lib/utils';
import { basicInfo, password as passwordForm, type FormSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { pb } from '$lib/database';

export const load = async () => {
  const basicInfoForm = await superValidate(zod(basicInfo));
  const passwordFormClient = await superValidate(zod(passwordForm));

  return { basicInfo: basicInfoForm, password: passwordFormClient };
}

export const actions: Actions = {
  checkEmail: async (event) => {
    const { locals, request, cookies, body } = event;

    // Get the raw form data
    const formData = await request.formData();
    const form = await superValidate(formData, zod(basicInfo));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    console.log("success");
    const { firstName, lastName, email } = form.data;

    console.log(form.data);

    // get the email domain
    const domain = email.split('@')[1];

    const school = await pb.collection('schools').getFirstListItem(`emailDomain = "${domain}"`)
    .catch((error) => {
      return null;
    });

    if (!school) {
      return setError(form, "email", "We are not partnered with your school");
    }

    const user = await pb.collection('users').getFirstListItem(`email ~ "${email}"`)
    .catch((error) => {
      return null;
    });

    if (user) {
      return setError(form, "email", "Email address is already in use");
    }

    return {
      school,
      form
    }
  },

	createAccount: async (event) => {
    const { locals, request, cookies, body } = event;

    // Get the raw form data
    const formData = await request.formData();

    // Access the Turnstile token
    const turnstileToken = formData.get('cf-turnstile-response');

    const schoolId = formData.get('schoolId');
    if (!schoolId) {
      return message(form, 'No school ID', {
        status: 400
      });
    }

    const form = await superValidate(formData, zod(passwordForm));
    if (!await validateToken(turnstileToken, CF_CAPTCHA_SECRET)) {
      return message(form, 'Failed to verify CAPTCHA', {
        status: 400
      });
    }

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const { firstName, lastName, email, password } = form.data;

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
      return null;
    });
    console.log(user);

    if (user === null) {
      return message(form, "Failed to create the account", {status: 500 });
    }

    const verificationSent = await pb.collection('users').requestVerification(email)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return false;
    });

    if (!verificationSent) {
      return message(form, "Failed to send verification email", {status: 500 });
    }

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

    return redirect(303, '/verify');
  }
};