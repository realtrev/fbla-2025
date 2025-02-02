<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { linear } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { CircleAlert, ExternalLink } from 'lucide-svelte';
  import { submitForm } from '$lib/utils';
	import { FormUtils } from '$lib/formUtils';
	import HCaptcha from '$lib/components/HCaptcha.svelte';
  import type { ActionResult } from '@sveltejs/kit';
	import Loading from '$lib/components/Loading.svelte';

  let email = $state("");
  let emailError = $state("");
  let validEmail = $state(true);

  let loginStatus = $state(true);

  let page = $state(1);
  let realPage = $state(1);

  function handlePage1Form(e: Event) {
    e.preventDefault();
    console.log('Form submitted');
    if (loginStatus == false) {
      return;
    }

    loginStatus = false;
    // all elements in #form data-form-element
    const inputs = Array.from(document.querySelectorAll("#form [data-form-element]"));

    submitForm(inputs, e, formSuccess, formFailed);

    function formFailed() {
      loginStatus = true;
    }

    function formSuccess() {
      globalError = "";
      FormUtils.submitForm('??/checkEmail', {
        email,
      })
      .then((response: ActionResult) => {
        console.log(response);

        if (response.type === "failure") {
          if (response.data?.message) {
            globalError = response.data.message;
          }

          if (response.data?.emailMessage) {
            emailError = response.data.emailMessage;
            validEmail = false;
          }
        }

        if (response.type === "success") {
          page = 2;
          school = response.data?.school;
        }

        loginStatus = true;
      })
      .catch((error) => {
        console.log('Error', error);
        globalError = `Couldn't submit form`;
        loginStatus = true;
      });
    }
  }

  function handleFormSubmission(token: string) {
    page = 1;

    FormUtils.submitForm('??/checkEmail', {
      email,
    })
    .then(async (response: { type: string; status: Number; location?: string; data: Object }) => {
      console.log(response);

      // pb.authStore.loadFromCookie(document.cookie);
      // currentUser.set(pb.authStore.record);

      if (response.type === "redirect" && response.location) {
        window.location.href = response?.location;
      }

      loginStatus = true;
    })
    .catch((error) => {
      console.log('Error', error);
      globalError = `Couldn't submit form`;
    });
  }

  function formatEmail(e: InputEvent) {
    // make sure no spaces are allowed or invalid characters like , or ; or :
		const input = e.target as HTMLInputElement;
		input.value = input.value.replace(/[^a-zA-Z0-9@._-]/g, '');
  }
</script>

<svelte:head>
  <title>Register | JobFair</title>
</svelte:head>

<style>
  form {
    @apply sm:px-24 px-8 py-16 md:py-12 flex flex-col items-center justify-center grow w-screen md:w-auto;
  }

  .form-title {
    @apply  font-semibold w-full mt-6 leading-tight;
  }

  .form-subtitle {
    @apply text-surface-8 font-normal text-base w-full whitespace-nowrap mb-6 leading-tight;
  }
</style>

<div class="w-full overflow-y-auto overflow-x-hidden flex justify-center h-max"
in:fade={{ delay: 300, duration: 300, easing: linear }}
>
  {#if realPage == 1 && page == 1}
    <form
    in:fade={{ delay: 300, duration: 300, easing: linear }}
    out:fade={{ duration: 300, easing: linear }}
    onoutroend={() => {
      realPage = page;
    }}
    onsubmit={handlePage1Form}
    >
      <div class="w-full">
        <Logo class="h-12 mr-auto" icon="accent" text="dark" />
      </div>
      <h1 class="heading-xl form-title">Create a student account!</h1>
      <p class="form-subtitle">Start finding jobs today</p>
      <div class="w-full grid grid-cols-2 gap-3">
        <TextInput
          name="firstName"
          class="col-span-1"
          maxlength={100}
          showcounter={false}
          label="First name"
          required
          type="text"
          size="lg"
          bind:value={firstName}
          transform={(value) => value.trim()}
        />

        <TextInput
          name="lastName"
          class="col-span-1"
          maxlength={100}
          showcounter={false}
          label="Last name"
          required
          type="text"
          size="lg"
          bind:value={lastName}
          transform={(value) => value.trim()}
        />
      </div>

      <TextInput
        name="email"
        class="col-span-1 w-full mt-6"
        maxlength={100}
        showcounter={false}
        label="School email address"
        type="email"
        required
        size="lg"
        bind:value={email}
        bind:error={emailError}
        bind:valid={validEmail}
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

      <div class="w-full flex justify-end md:pl-6">
        <Button
          disabled={!loginStatus}
          color="primary"
          class="md:w-1/2 w-full mt-6 shadow-lg shadow-primary-5/25"
          size="xl"
          submit={true}
        >
          {#if loginStatus}
            <p>Next</p>
          {:else}
            <Loading />
          {/if}
        </Button>
      </div>

      {#if globalError}
      <div class="flex items-top mt-3">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{globalError}</span>
      </div>
      {/if}

      <div class="w-full mt-6">
        <p class="font-normal text-surface-5 text-sm w-min whitespace-nowrap">Already have an account? <a class="link" href="/login">Log in!</a></p>
      </div>
  </form>
{/if}
{#if realPage == 2 && page == 2}
    <form
    in:fade={{ delay: 300, duration: 300, easing: linear }}
    out:fade={{ duration: 300, easing: linear }}
    onoutroend={() => {
      realPage = page;
    }}
    onsubmit={handlePage2Form}
    >
      <div class="w-full">
        <Logo class="h-12 mr-auto" icon="accent" text="dark" />
      </div>
      <h1 class="heading-xl form-title">Create an account password.</h1>
      <p class="form-subtitle">Keep your account secure</p>

      <div class="rounded-xl border border-surface-3 w-full mt-0.5">
        <div class="p-6 flex flex-col items-center">
          <img src={school.logo} alt="School logo" class="h-20 aspect-square mx-auto" />
          <h1 class="heading-sm text-center w-full mt-3">{school.name}</h1>
          <a class="link text-sm font-normal flex items-center" href={school.website} onclick={(e) => {
            e.preventDefault();
            window.open(school.website, '_blank');
          }}>
          <ExternalLink class="h-4 w-4 inline-block mr-0.5" />
          {school.website ? school?.website?.split("://")[1] : "No school"}</a>
        </div>
        <div class="p-6 flex gap-3 border-t border-surface-3 items-center">
          <div class="w-14 h-14 shrink-0 rounded-full overflow-hidden bg-primary-5 flex items-center justify-center text-white select-none">
            {#if firstName && lastName}
            <p>{firstName[0]}{lastName[0]}</p>
            {/if}
          </div>
          <div class="shrink overflow-hidden overflow-hidden">
            <h1 class="heading-lg font-bold line-clamp-1">{firstName} {lastName}</h1>
            <h2 class="text-surface-7 font-normal leading-tight line-clamp-1">{email}</h2>
          </div>
        </div>
      </div>
      <button class="link w-min mr-auto font-normal whitespace-nowrap text-sm mt-0.5 select-text" onclick={() => page = 1}>Not you?</button>


      <TextInput
        name="password"
        class="col-span-1 mt-6 w-full"
        label="Password"
        type="password"
        required
        size="lg"
        bind:value={password}
        transform={(value) => value.trim()}
        oninput={formatEmail}
        validate={(value) => {
          // password must be at least 8 characters long
          if (value.length < 8) {
            throw new Error('Password must be at least 8 characters long');
          }

          // password must contain at least one number
          if (!/\d/.test(value)) {
            throw new Error('Password must contain at least one number');
          }

          // password must contain at least one special character check for any non-alphanumeric character
          if (!/\W/.test(value)) {
            throw new Error('Password must contain at least one special character');
          }
          return true;
        }}
      />

      <TextInput
        name="password confirm"
        class="col-span-1 w-full mt-6"
        label="Confirm password"
        type="password"
        required
        size="lg"
        bind:value={confirmPassword}
        transform={(value) => value.trim()}
        oninput={formatEmail}
        validate={(value) => {
          if (value !== password) {
            throw new Error('Passwords do not match');
          }
          return true;
        }}
      />

      <div class="w-full flex justify-end gap-3">
        <Button
          label="Back"
          color="surface"
          class="w-full mt-6"
          size="xl"
          onclick={() => {
            page = 1;
          }}
        >
        </Button>

        <Button
          disabled={!loginStatus}
          color="primary"
          class="w-full mt-6 shadow-lg shadow-primary-5/25"
          size="xl"
          submit={true}
        >
          {#if loginStatus}
            <p>Next</p>
          {:else}
            <Loading />
          {/if}
        </Button>
      </div>

      {#if globalError}
      <div class="flex items-top mt-3">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{globalError}</span>
      </div>
      {/if}
  </form>
{/if}
{#if realPage == 3 && page == 3}
  <form
    in:fade={{ delay: 300, duration: 300, easing: linear }}
    out:fade={{ duration: 300, easing: linear }}

    onoutroend={() => {
      realPage = page;
    }}
  >

    <h1 class="heading-xl font-bold w-full mt-6 leading-tight">Just one more thing...</h1>
    <p class="text-surface-8 font-normal text-base w-full whitespace-nowrap mb-6 leading-tight">Confirm you're not a bot</p>
    <HCaptcha class="mt-3" onverify={(newToken: string) => {
      handleFormSubmission(newToken);
    }} />

    <div class="w-full flex justify-end gap-3">
      <Button
        label="Back"
        color="surface"
        class="w-full mt-6"
        size="xl"
        onclick={() => {
          page = 2;
        }}
      >
      </Button>

      <Button
        disabled={!loginStatus}
        color="primary"
        class="w-full mt-6 shadow-lg shadow-primary-5/25"
        size="xl"
        submit={true}
      >
        {#if loginStatus}
          <p>Create my account</p>
        {:else}
          <Loading />
        {/if}
      </Button>
    </div>
  </form>
{/if}
</div>