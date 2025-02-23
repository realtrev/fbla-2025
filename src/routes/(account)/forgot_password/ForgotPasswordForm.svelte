<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Form from "$lib/components/ui/form";
  import Logo from '$lib/components/Logo.svelte';
  import { emailOnly } from './emailOnly';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY, PUBLIC_POCKETBASE_URL } from '$env/static/public';
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';

  import LoaderCircleIcon from 'lucide-svelte/icons/loader-circle';

  let { form: formGiven, title, subtitle, emaillabel, successurl } = $props();

  let submitting = $state(false);
  let dialogOpen = $state(false);

	let reset = $state<() => void>();

  const form = superForm(formGiven, {
    validators: zodClient(emailOnly),
    validationMethod: 'onsubmit',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      submitting = false;
      console.log(result);

      if (result?.type === "success") {
        dialogOpen = true;
      }

      if (result?.data?.form) {
        $message = result.data.form.message;
        $errors = result.data.form.errors;
      }

      reset?.();
    },
    resetForm: () => false
  });


  const { form: formData, enhance, message, errors } = form;
</script>

<AlertDialog.Root bind:open={dialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Success!</AlertDialog.Title>
      <AlertDialog.Description>
        Your password reset email was sent. Please check your email. Select below to return to the log in page.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <Button onclick={(e) => e.preventDefault()} href={successurl}>Log in</Button>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

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

    <form method="POST" use:enhance action="?/resetPassword">
      <Turnstile
        siteKey={PUBLIC_CF_SITEKEY}
        action="turnstile"
        size="invisible"
        bind:reset
      />
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
        </div>

        {#if $message}
          <Label class="w-full text-center mb-3">{$message}</Label>
        {/if}

        <Form.Button disabled={submitting} class="w-full" type="submit" action="?/">
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
  </div>