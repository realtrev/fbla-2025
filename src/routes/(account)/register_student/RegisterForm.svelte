<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
  import * as Form from "$lib/components/ui/form";
  import ExternalLink from 'lucide-svelte/icons/external-link';
  import Logo from '$lib/components/Logo.svelte';
  import { basicInfo, password, type BasicInfoForm } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY, PUBLIC_POCKETBASE_URL } from '$env/static/public';
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';

  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';
  import { onDestroy, onMount } from 'svelte';
  import { createEnterKeyHandler } from '$lib/utils';

  let { page1, page2, title, subtitle } = $props();

  let submitForm;
  let submitButton = $state(null);

  let page = $state(1);
  let school = $state(null) as SchoolModel;
  let submitting = $state(false);

	let reset = $state<() => void>();

  const form = superForm(page1, {
    validators: zodClient(basicInfo),
    validationMethod: 'onsubmit',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      submitting = false;
      console.log(result);

      if (result.type === "redirect") {
        window.location.href = result.location;
      }

      if (result?.data?.form) {
        $message1 = result.data.form.message;
        $errors1 = result.data.form.errors;
      }

      if (result?.data?.school) {
        school = result?.data?.school;
        school.logo = `${PUBLIC_POCKETBASE_URL}/api/files/${school.collectionId}/${school.id}/${school.logo}`;
        page = 2;
      }
    },
    resetForm: () => false
  });

  const secondPage = superForm(page2, {
    validators: zodClient(password),
    validationMethod: 'onsubmit',
    onSubmit: ({ action, formData }) => {
      submitting = true;

      formData.append("firstName", $page1Data.firstName);
      formData.append("lastName", $page1Data.lastName);
      formData.append("email", $page1Data.email);
      formData.append("schoolId", school.id);
    },
    onResult: ({ result, formElement, cancel }) => {
      submitting = false;
      console.log(result);

      if (result.type === "redirect") {
        window.location.href = result.location;
      }

      if (result?.data?.form) {
        $message2 = result.data.form.message;
        $errors2 = result.data.form.errors;

        if (result?.data.form.posted) {
          reset?.();
        }
      }
    },
    resetForm: () => false,
    dataType: 'json'
  });

  const { form: page1Data, enhance: enhance1, message: message1, errors: errors1 } = form;


  const { form: page2Data, enhance: enhance2, message: message2, errors: errors2 } = secondPage;


  let cleanup;
  onMount(() => {
    cleanup = createEnterKeyHandler(submitForm, submitButton);
  });

  onDestroy(() => {
    if (cleanup) {
      cleanup();
    }
  });
</script>

<div class="p-6 flex flex-col w-[28rem]" >
  <div class="w-full justify-center flex mb-4">
    <Logo class="fill-background" />
  </div>

  <h2 class="text-2xl font-semibold w-full text-center">
    {title}
  </h2>

  <p class="w-full text-center text-muted-foreground text-sm">
    {subtitle}
  </p>

    <form class={page === 1 ? "" : "hidden"} method="POST" use:enhance1 action="?/checkEmail">
      <div class="my-6 gap-4 grid">
        <div class="grid gap-4 md:grid-cols-2">
            <Form.Field {form} name="firstName">
              <Form.Control>
                {#snippet children({ props })}
                  <div class="grid gap-1">
                    <Form.Label class="text-sm">First Name</Form.Label>
                    <Input {...props} id="firstName" type="text" class="w-full" bind:value={$page1Data.firstName} />
                    <Form.FieldErrors class="text-xs" />
                  </div>
                {/snippet}
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="lastName">
              <Form.Control>
              {#snippet children({ props })}
                <div class="grid gap-1">
                  <Form.Label class="text-sm">Last Name</Form.Label>
                  <Input {...props} id="lastName" type="text" class="w-full" bind:value={$page1Data.lastName} />
                  <Form.FieldErrors class="text-xs" />
                </div>
              {/snippet}
              </Form.Control>
            </Form.Field>
        </div>

          <Form.Field {form} name="email">
            <Form.Control>
              {#snippet children({ props })}
                <div class="grid gap-1">
                  <Form.Label class="text-sm">Student Email</Form.Label>
                  <Input {...props} id="email" placeholder="t@mail.com" type="email" class="w-full" bind:value={$page1Data.email} />
                  <Form.FieldErrors class="text-xs" />
                </div>
              {/snippet}
            </Form.Control>
          </Form.Field>
        </div>

        {#if $message1}
          <Label class="w-full text-center mb-3">{$message1}</Label>
        {/if}

        <Form.Button disabled={submitting} class="w-full" type="submit">
          {#if submitting}
            <LoaderCircleIcon class="w-5 h-5 animate-spin mr-1" />
          {/if}
          Continue
        </Form.Button>

        <div class="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?
          <a href="/login" class="underline">Sign in</a>
        </div>
      </form>
      <form bind:this={submitForm} class={page === 2 ? "" : "hidden"} method="POST" use:enhance2 action="?/createAccount">
        {#if page === 2}
        <div class="rounded-xl border border-surface-3 w-full mt-6">
          <div class="p-6 flex flex-col items-center">
            <img src={school.logo} alt="School logo" class="h-20 aspect-square mx-auto" />
            <h1 class="heading-sm text-center w-full mt-3">{school.name}</h1>
            <a class="link text-sm font-normal flex items-center underline" href={school.website} onclick={(e) => {
              e.preventDefault();
              window.open(school.website, '_blank');
            }}>
            <ExternalLink class="h-4 w-4 inline-block mr-0.5" />
            {school.website ? school?.website?.split("://")[1] : "No school"}</a>
          </div>
          <div class="p-6 flex gap-3 border-t items-center">
            <div class="w-14 h-14 shrink-0 rounded-full overflow-hidden bg-primary/75 flex items-center justify-center text-background select-none">
              {#if $page1Data.firstName && $page1Data.lastName}
              <p>{$page1Data.firstName[0]}{$page1Data.lastName[0]}</p>
              {/if}
            </div>
            <div class="shrink overflow-hidden">
              <h1 class="line-clamp-1">{$page1Data.firstName} {$page1Data.lastName}</h1>
              <p class="text-muted-foreground font-normal leading-tight line-clamp-1">{$page1Data.email}</p>
            </div>
          </div>
        </div>
        <!--<button class="text-primary underline w-min mr-auto whitespace-nowrap text-xs mt-0.5" onclick={(e) => { e.preventDefault(); page = 1; }}>Not you?</button>-->


        <!--<div class="w-full p-3 border rounded-lg bg-foreground/5 shadow mt-6">-->
        <!--  {#if school !== null}-->
        <!--    {school.name}-->
        <!--  {/if}-->
        <!--</div>-->
        {/if}

        <div class="my-6 gap-4 grid">
          <div class="grid gap-4 md:grid-cols-2">
            <Form.Field form={secondPage} name="password">
              <Form.Control>
                {#snippet children({ props })}
                  <div class="grid gap-1">
                    <Form.Label class="text-sm">Password</Form.Label>
                    <Input {...props} id="password" type="password" class="w-full" bind:value={$page2Data.password} />
                    <Form.FieldErrors class="text-xs" />
                  </div>
                {/snippet}
              </Form.Control>
            </Form.Field>

            <Form.Field form={secondPage} name="passwordConfirm">
              <Form.Control>
              {#snippet children({ props })}
                <div class="grid gap-1">
                  <Form.Label class="text-sm">Confirm Password</Form.Label>
                  <Input {...props} id="passwordConfirm" type="password" class="w-full" bind:value={$page2Data.passwordConfirm} />
                  <Form.FieldErrors class="text-xs" />
                </div>
              {/snippet}
              </Form.Control>
            </Form.Field>
          </div>
        </div>

        <Turnstile
          siteKey={PUBLIC_CF_SITEKEY}
          action="turnstile"
          size="flexible"
          theme="light"
          bind:reset
        />

        <div class="grid gap-4 grid-cols-2 mt-6">
          <Button variant="secondary" disabled={submitting} class="w-full" onclick={() => page = 1}>
            Back
          </Button>

          <Form.Button disabled={submitting} class="w-full" type="submit" bind:ref={submitButton}>
            {#if submitting}
              <LoaderCircleIcon class="w-5 h-5 animate-spin mr-1" />
            {/if}
            Create my account
          </Form.Button>
        </div>
      </form>
  </div>