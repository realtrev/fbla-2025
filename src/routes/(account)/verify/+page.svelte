<script lang="ts">
  import Button from '$lib/components/Button.svelte';
	import { linear } from 'svelte/easing';
	import { fade } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { CircleAlert } from 'lucide-svelte';
  import { submitForm } from '$lib/utils';
	import HCaptcha from '$lib/components/HCaptcha.svelte';
	import Loading from '$lib/components/Loading.svelte';
  import { currentUser, pb } from '$lib/pocketbase';
	import type { AuthRecord } from 'pocketbase';
	import { FormUtils } from '$lib/formUtils';
	import type { ActionResult } from '@sveltejs/kit';

  currentUser.subscribe((user: AuthRecord) => {
    if (user.verified && window) {
      window.location.href = "/app";
    }
  });

  let loginStatus = $state(true);
  let token = $state("");

  let globalError = $state("");

  let page = $state(1);
  let realPage = $state(1);

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
      loginStatus = true;
    }

    function formSuccess() {
      loginStatus = true;
      page = 2;
    }
  }

  function resendVerification(e: Event) {
    e.preventDefault();

    loginStatus = false;
    // all elements in #form data-form-element
    const inputs = Array.from(document.querySelectorAll("#form [data-form-element]"));

    submitForm(inputs, e, formSuccess, formFailed);

    function formFailed() {
      loginStatus = true;
    }

    function formSuccess() {
      FormUtils.submitForm("??/resendVerificationEmail", {
        token: token,
        action: "resendVerification",
        email: $currentUser?.email,
      }).then((res: ActionResult) => {
        if (res.type == "success") {
          globalError = "";
          page = 1;
        } else if (res.type === "failure") {
          globalError = res?.data?.message ?? "An error occurred";
          page = 1;
        }

        loginStatus = true;
      })
      .catch((err) => {
        globalError = "An error occurred";
        loginStatus = true;
        page = 1;
      });
    }
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
    @apply text-surface-8 font-normal text-base w-full mb-6 leading-tight;
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
      <h1 class="heading-xl form-title">Welcome to JobFair!</h1>
      <p class="form-subtitle">Check your email inbox to verify your account. You'll be redirected automatically.</p>

      <div class="w-full flex justify-end">
        <Button
          disabled={!loginStatus}
          color="primary"
          class="w-full mt-6 shadow-lg shadow-primary-5/25"
          size="xl"
          submit={true}
        >
          {#if loginStatus}
            <p>Resend verification email</p>
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
{#if realPage == 2 && page == 2}
  <form
    in:fade={{ delay: 300, duration: 300, easing: linear }}
    out:fade={{ duration: 300, easing: linear }}

    onoutroend={() => {
      realPage = page;
    }}

    onsubmit={resendVerification}
  >

    <h1 class="heading-xl font-bold w-full mt-6 leading-tight">Resend verification email...</h1>
    <p class="text-surface-8 font-normal text-base w-full whitespace-nowrap mb-6 leading-tight">Confirm you're not a bot</p>
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
        color="primary"
        class="w-full mt-6 shadow-lg shadow-primary-5/25"
        size="xl"
        submit={true}
      >
        {#if loginStatus}
          <p>Resend email</p>
        {:else}
          <Loading />
        {/if}
      </Button>
    </div>
  </form>
{/if}
</div>