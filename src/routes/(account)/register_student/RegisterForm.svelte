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

  let { page1, page2, title, subtitle } = $props();

  let page = $state(1);
  let school = $state(null) as SchoolModel;
  let submitting = $state(false);

	let reset = $state<() => void>();
	let reset2 = $state<() => void>();



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

      reset?.();
    },
    resetForm: () => false
  });

  const secondPage = superForm(page2, {
    validators: zodClient(password),
    validationMethod: 'onsubmit',
    onSubmit: ({ action, formData }) => {
      submitting = true;
      $page2Data.email = $page1Data.email;
      $page2Data.firstName = $page1Data.firstName;
      $page2Data.lastName = $page1Data.lastName;

      formData.append("schoolId", school.id);
    },
    onResult: ({ result, formElement, cancel }) => {
      reset2?.();
      submitting = false;
      console.log(result);

      if (result.type === "redirect") {
        window.location.href = result.location;
      }

      if (result?.data?.form) {
        $message2 = result.data.form.message;
        $errors2 = result.data.form.errors;
      }
    },
    resetForm: () => false
  });

  const { form: page1Data, enhance: enhance1, message: message1, errors: errors1 } = form;


  const { form: page2Data, enhance: enhance2, message: message2, errors: errors2 } = secondPage;
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
      {#if page === 1}
      <Turnstile
        siteKey={PUBLIC_CF_SITEKEY}
        action="turnstile"
        size="invisible"
        bind:reset
      />
      {/if}
      <div class="my-6 gap-4 grid">
        <div class="grid gap-4 md:grid-cols-2">
            <Form.Field {form} name="firstName">
              <Form.Control let:attrs>
              <div class="grid gap-1">
                <Form.Label class="text-sm">First Name</Form.Label>
                <Input {...attrs} id="firstName" type="text" class="w-full" bind:value={$page1Data.firstName} />
                <Form.FieldErrors class="text-xs" />
              </div>
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="lastName">
              <Form.Control let:attrs>
              <div class="grid gap-1">
                <Form.Label class="text-sm">Last Name</Form.Label>
                <Input {...attrs} id="lastName" type="text" class="w-full" bind:value={$page1Data.lastName} />
                <Form.FieldErrors class="text-xs" />
              </div>
              </Form.Control>
            </Form.Field>
        </div>

          <Form.Field {form} name="email">
            <Form.Control let:attrs>
            <div class="grid gap-1">
              <Form.Label class="text-sm">Student Email</Form.Label>
              <Input {...attrs} id="email" placeholder="t@mail.com" type="email" class="w-full" bind:value={$page1Data.email} />
              <Form.FieldErrors class="text-xs" />
            </div>
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
      <form class={page === 2 ? "" : "hidden"} method="POST" use:enhance2 action="?/createAccount">
        {#if page === 2}
        <Turnstile
          siteKey={PUBLIC_CF_SITEKEY}
          action="turnstile"
          size="invisible"
          bind:reset2
        />
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
          <div class="hidden">
            <Form.Field form={secondPage} name="firstName">
              <Form.Control let:attrs>
              <Input {...attrs} id="firstName" type="hidden" class="w-full" bind:value={$page1Data.firstName} />
              </Form.Control>
            </Form.Field>
            <Form.Field form={secondPage} name="lastName">
              <Form.Control let:attrs>
              <Input {...attrs} id="lastName" type="hidden" class="w-full" bind:value={$page1Data.lastName} />
              </Form.Control>
            </Form.Field>
            <Form.Field form={secondPage} name="email">
              <Form.Control let:attrs>
              <Input {...attrs} id="email" type="hidden" class="w-full" bind:value={$page1Data.email} />
              </Form.Control>
            </Form.Field>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <Form.Field form={secondPage} name="password">
              <Form.Control let:attrs>
              <div class="grid gap-1">
                <Form.Label class="text-sm">Password</Form.Label>
                <Input {...attrs} id="password" type="password" class="w-full" bind:value={$page2Data.password} />
                <Form.FieldErrors class="text-xs" />
              </div>
              </Form.Control>
            </Form.Field>

            <Form.Field form={secondPage} name="passwordConfirm">
              <Form.Control let:attrs>
              <div class="grid gap-1">
                <Form.Label class="text-sm">Confirm Password</Form.Label>
                <Input {...attrs} id="passwordConfirm" type="password" class="w-full" bind:value={$page2Data.passwordConfirm} />
                <Form.FieldErrors class="text-xs" />
              </div>
              </Form.Control>
            </Form.Field>
          </div>
        </div>

        <Label class="w-full text-center mb-3">{$message2}</Label>

        <Form.Button disabled={submitting} class="w-full">
          {#if submitting}
            <LoaderCircleIcon class="w-5 h-5 animate-spin mr-1" />
          {/if}
          Create my account
        </Form.Button>
      </form>
  </div>