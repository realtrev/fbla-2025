<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { linear } from 'svelte/easing';
	import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { CircleAlert } from 'lucide-svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import { submitForm } from '$lib/utils';
	import { FormUtils } from '$lib/formUtils';
	import HCaptcha from '$lib/components/HCaptcha.svelte';

  let email = $state("");
  let password = $state("");
  let bio = $state("");
  let image: File | null = $state(null);
  let emailError = $state("");
  let emailObj: TextInput | null = $state(null);
  let globalError = $state("");

  let loginStatus = $state(true);

  let page = $state(1);

  function handlePage1Form(e: Event) {
    e.preventDefault();
    if (loginStatus == false) {
      return;
    }

    loginStatus = false;
    // all elements in #form data-form-element
    const inputs = Array.from(document.querySelectorAll("#form [data-form-element]"));

    submitForm(inputs, e, formSuccess, formFailed);

    function formFailed() {
      console.log('Form failed');
      loginStatus = true;
    }

    function formSuccess() {
      // next page
      console.log('Form success');
      page = 2;
    }
  }

  function handleFormSubmission(token: string) {
    console.log('Form submitted with token:', token);

    const form = new FormData();
    form.append('email', email);
    form.append('password', password);
    form.append('token', token);

    FormUtils.submitForm('??/login', form)
      .then((response) => {
        if (response.status == 200) {
          // success
          console.log('Success');
        } else {
          // error
          console.log('Error');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  function formatEmail(e: InputEvent) {
    // make sure no spaces are allowed or invalid characters like , or ; or :
		const input = e.target as HTMLInputElement;
		input.value = input.value.replace(/[^a-zA-Z0-9@._-]/g, '');
  }
</script>

<div class="w-full h-screen flex flex-col justify-center bg-surface-8">
  <div id="form" class=" bg-white max-w-[42rem] grow h-screen">
    <div class="w-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center h-screen">
      <Logo class="h-12" icon="accent" text="dark" />
      {#if page == 1}
        <form
        class="w-full shrink-0 px-32 flex flex-col items-center justify-center"
        in:fade={{ delay: 300, duration: 300, easing: linear }}
        out:fade={{ duration: 300, easing: linear }}
        >
          <h1 class="heading-xl font-normal w-full mt-6 leading-tight">Welcome back!</h1>
          <p class="text-surface-8 font-normal text-base w-full whitespace-nowrap mb-6 leading-tight">Sign in to your account</p>
          <TextInput
            name="email"
            class="col-span-1 w-full"
            maxlength={100}
            showcounter={false}
            label="Email address"
            type="email"
            size="lg"
            bind:value={email}
            bind:error={emailError}
            transform={(value) => value.trim()}
            oninput={formatEmail}
            validate={(value) => {
              const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
              if (!emailRegex.test(value)) {
                throw new Error('Invalid email');
              }
              return true;
            }}
          />

          <TextInput
            name="password"
            class="col-span-1 w-full mt-6 heading-xl"
            maxlength={100}
            showcounter={false}
            label="Password"
            type="password"
            size="lg"
            bind:value={password}
            validate={(value) => {
              if (value.length < 8) {
                throw new Error('Password must be at least 8 characters long');
              }
              return true;
            }}
          >
            {#snippet rightLabel()}
              <a class="link text-sm font-normal" href="student-recovery">Forgot password?</a>
            {/snippet}
          </TextInput>

          <div class="w-full flex justify-end">
            <Button
              label="Sign in"
              disabled={!loginStatus}
              color="primary"
              class="w-full mt-6 shadow-lg shadow-primary-5/25"
              size="xl"
              submit={true}
              onsubmit={handlePage1Form}
            >
            </Button>
          </div>

          {#if globalError}
          <div class="flex items-center mt-3">
            <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
            <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{globalError}</span>
          </div>
          {/if}

          <div class="w-full mt-6">
            <p class="font-normal text-surface-5 text-sm w-min whitespace-nowrap">Don't have an account? <a class="link" href="/student-register">Create one!</a></p>
          </div>
      </form>
    {/if}
    {#if page == 2}
      <form
        class="w-full shrink-0 px-32 flex flex-col items-center justify-center"
        in:fade={{ delay: 300, duration: 300, easing: linear }}
        out:fade={{ duration: 300, easing: linear }}
      >
      
        <h1 class="heading-xl font-normal w-full mt-6 leading-tight">Just one more thing...</h1>
        <p class="text-surface-8 font-normal text-base w-full whitespace-nowrap mb-6 leading-tight">Confirm you're not a bot</p>
        <HCaptcha class="mt-3" onverify={(newToken: string) => {
          handleFormSubmission(newToken);
        }} />
      </form>
    {/if}
    </div>
  </div>
</div>