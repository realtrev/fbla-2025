<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
  import * as Form from "$lib/components/ui/form";
  import Logo from '$lib/components/Logo.svelte';
  import { schema, type FormSchema } from './schema';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY } from '$env/static/public'
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';

  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';

  let { form: givenForm, title, subtitle, emaillabel, showSignUp = false } = $props();

  let submitting = $state(false);

	let reset = $state<() => void>();

  const form = superForm(givenForm, {
    validators: zodClient(schema),
    validationMethod: 'onsubmit',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      submitting = false;

      if (result.type === "redirect") {
        window.location.href = result.location;
      }

      if (result.type === "failure") {
        if (result.data.form.message) {
          toast.error(result.data.form.message);
        }
        reset?.();
      }

      if (result?.data?.form) {
        $errors = result.data.form.errors;
      }
    },
    resetForm: () => false
  });

  const { form: formData, enhance, message, errors } = form;
</script>

<form class="p-6 flex flex-col w-[28rem]" method="POST" use:enhance>
    <div class="w-full justify-center flex mb-4">
      <Logo class="fill-background" />
    </div>

    <h2 class="text-2xl font-semibold w-full text-center">
      {title}
    </h2>

    <p class="w-full text-center text-muted-foreground text-sm">
      {subtitle}
    </p>

    <div class="my-6 gap-4 grid">

      <Form.Field {form} name="email">
        <Form.Control let:attrs>
        <div class="grid gap-1">
          <Form.Label class="text-sm">{emaillabel}</Form.Label>
          <Input {...attrs} id="email" placeholder="t@mail.com" type="email" class="w-full" bind:value={$formData.email} />
          <Form.FieldErrors class="text-xs" />
        </div>
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="password">
        <Form.Control let:attrs>
        {#snippet children({ props })}
          <div class="grid gap-1">
            <div class="w-full flex justify-between">
                <Form.Label class="text-sm w-min" for="password">Password</Form.Label>
                <a href="/forgot_password" class="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>
            </div>
            <Input {...props} id="password" type="password" class="w-full" bind:value={$formData.password} />
            <Form.FieldErrors class="text-xs" />
          </div>
        {/snippet}
        </Form.Control>
      </Form.Field>
    </div>

    <Turnstile
      siteKey={PUBLIC_CF_SITEKEY}
      action="turnstile"
      size="flexible"
      theme="light"
      bind:reset
    />

    <div class="mt-6">

    </div>

    <Form.Button disabled={submitting} class="w-full shadown" type="submit">
      {#if submitting}
        <LoaderCircleIcon class="w-5 h-5 animate-spin mr-1" />
      {/if}
      Sign in
    </Form.Button>

    {#if showSignUp}
      <div class="mt-4 text-center text-sm text-muted-foreground">
        Don't have an account?
        <a href="register_student" class="underline">Sign up</a>
      </div>
    {/if}
  </form>