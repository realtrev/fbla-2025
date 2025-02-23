<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Form from "$lib/components/ui/form";
  import Logo from '$lib/components/Logo.svelte';
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY } from '$env/static/public';
  import { superForm } from "sveltekit-superforms";
  import { deserialize } from '$app/forms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { onMount } from 'svelte';
  import { postAction } from '$lib/utils';

  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';

  let dialogOpen = $state(false);
  let turnstileToken = $state("");

  let cooldown = $state(5);

  function countDown() {
    cooldown -= 1;

    setTimeout(() => {
      countDown();
    }, 1000);
  }

	let reset = $state<() => void>();

  function turnstileCallback(e) {
    turnstileToken = e?.detail?.token;
  }

  const resendEmail = postAction("??/resendEmailVerification", {
    onSubmit: ({ formData, cancel }) => {
      formData.append("cf-turnstile-response", turnstileToken);
    },
    onError: (e) => {
      console.log(e);
    },
    onResult: ({ action }) => {
      cooldown = 30;
      toast.success("Resent verification email.");
    }
  });

  const { isSubmitting } = resendEmail;

  onMount(() => {
    countDown();
  });
</script>

<div class="p-6 flex flex-col w-[28rem]" >
  <div class="w-full justify-center flex mb-4">
    <Logo class="fill-background" />
  </div>

  <h2 class="text-2xl font-semibold w-full text-center">
    Verify your email!
  </h2>

  <p class="w-full text-center text-muted-foreground text-sm">
    You're almost there. Check your email for a verification link. Select below to send one again. Once you verify your account, you'll be automatically redirected.
  </p>

  <form onsubmit={resendEmail.submit}>
    <Turnstile
      siteKey={PUBLIC_CF_SITEKEY}
      action="turnstile"
      size="invisible"
      on:callback={turnstileCallback}
      bind:reset
    />
    <div class="mt-6 gap-4 grid">
      <Button disabled={$isSubmitting || cooldown > 0} class="w-full" type="submit">
        {#if $isSubmitting}
          <LoaderCircleIcon class="w-5 h-5 animate-spin mr-1" />
        {/if}
        {#if cooldown > 0}
          Resend email verification: {cooldown}
        {:else}
          Resend email verification
        {/if}
      </Button>
    </div>
  </form>
</div>