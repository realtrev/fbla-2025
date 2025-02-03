<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { linear } from 'svelte/easing';
	import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { CircleAlert } from 'lucide-svelte';
  import { submitForm } from '$lib/utils';
	import { FormUtils } from '$lib/formUtils';
	import HCaptcha from '$lib/components/HCaptcha.svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import type { ActionResult } from '@sveltejs/kit';
	import Loading from '$lib/components/Loading.svelte';

  let email = $state("");
  let password = $state("");
  let token = $state("");

  let emailError = $state("");
  let globalError = $state("");

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
      page = 2;
      loginStatus = true;
    }
  }

  function handleFormSubmission(e: Event) {
    e.preventDefault();
    page = 1;
    loginStatus = false;
    globalError = "";

    FormUtils.submitForm('??/login', {
      email,
      password,
      token,
    })
    .then(async (response: ActionResult) => {

      if (response.type === "success") {
        pb.authStore.loadFromCookie(document.cookie);
        currentUser.set(pb.authStore.record);
      } else if (response.type === "failure") {
        globalError = response.data?.message;
      }

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
  <title>Login | JobFair</title>
</svelte:head>

<style>
  form {
    @apply sm:px-12 px-8 py-12 flex flex-col items-center justify-center grow w-screen md:w-auto;
  }

  .form-title {
    @apply  font-semibold w-full mt-3 leading-tight;
  }

  .form-subtitle {
    @apply text-surface-8 font-normal text-base w-full whitespace-nowrap mb-8 leading-tight;
  }
</style>

<div class="w-full overflow-y-auto overflow-x-hidden flex items-left justify-center h-auto"
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
      <div class="w-full focus-none">
        <Logo class="h-12 mr-auto" icon="dark" text="dark" />
      </div>
      <h1 class="heading-xl form-title">Organization Login</h1>
      <p class="form-subtitle">Sign in to your account</p>
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
          <a class="link text-sm font-normal" href="recovery">Forgot password?</a>
        {/snippet}
      </TextInput>

      <div class="w-full flex justify-end">
        <Button
          disabled={!loginStatus}
          color="black"
          class="w-full mt-8 shadow-lg shadow-primary-5/25"
          size="xl"
          submit={true}
        >
        {#if loginStatus}
          <p>Sign in</p>
        {:else}
          <Loading />
        {/if}
        </Button>
      </div>

      {#if globalError}
      <div class="flex items-center mt-3">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{globalError}</span>
      </div>
      {/if}

      <!-- <div class="w-full mt-6">
        <p class="font-normal text-surface-5 text-sm w-min whitespace-nowrap">Don't have an account? <a class="link" href="/register_student">Create one!</a></p>
      </div> -->
  </form>
{/if}
{#if realPage == 2 && page == 2}
  <form
    in:fade={{ delay: 300, duration: 300, easing: linear }}
    out:fade={{ duration: 300, easing: linear }}
    onoutroend={() => {
      realPage = page;
    }}
    onsubmit={handleFormSubmission}
  >
    <div class="w-full">
      <Logo class="h-12 mr-auto" icon="accent" text="dark" link="/" />
    </div>
    <h1 class="heading-xl form-title">Just one more thing...</h1>
    <p class="form-subtitle">Confirm you're not a bot</p>
    <HCaptcha class="mt-3" onverify={(newToken: string) => {
      token = newToken;
    }} />

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
        color="black"
        class="w-full mt-6 shadow-lg shadow-primary-5/25"
        size="xl"
        submit={true}
      >
        {#if loginStatus}
          <p>Sign in</p>
        {:else}
          <Loading />
        {/if}
      </Button>
    </div>
  </form>
{/if}
</div>