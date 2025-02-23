<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Label } from "$lib/components/ui/label/index.js";
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import Logo from '$lib/components/Logo.svelte';
  import { editSchema, type FormSchema } from './editListing';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY } from '$env/static/public'
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';
  import Combobox from '$lib/components/Combobox.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { postAction } from '$lib/utils';
  import { goto } from '$app/navigation';


  let {
    listing,
    form: givenForm
  }: {
    listing: ListingModel;
    form: FormSchema
  } = $props();

  let submitting = $state(false);

  const form = superForm(givenForm, {
    validators: zodClient(editSchema),
    validationMethod: 'onsubmit',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      submitting = false;

      if (result.type === "success") {
        toast.success("Saved listing.");
      }

      if (result.type === "redirect") {
        window.location.href = result.location;
      }

      if (result.type === "failure") {
        if (result?.data?.form?.message) {
          toast.error(result?.data.form.message);
        }
      }

      if (result?.data?.form) {
        $errors = result.data.form.errors;
      }
    },
    resetForm: () => false
  });

  const deleteListing = postAction("??/deleteListing", {
    onResult: ({ action }) => {
      toast.success("Deleted listing.");
      goto("/admin/o/listings");
    }
  });

  const { isSubmitting } = deleteListing;

  const { form: formData, enhance, message, errors } = form;

  const options = [
    {
      value: "volunteer",
      label: "Volunteer"
    },
    {
      value: "full-time",
      label: "Full Time"
    },
    {
      value: "part-time",
      label: "Part Time"
    },
    {
      value: "internship",
      label: "Internship"
    }
  ];

  let deleteAlertOpen = $state(false);

  $formData.title = listing.title;
  $formData.description = listing.description;
  $formData.type = listing.type;

  let selectValue = $state(options.slice().find(o => o.value === $formData.type) ?? {});
</script>

<AlertDialog.Root bind:open={deleteAlertOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this listing.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={deleteListing.submit}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Card.Root class="mt-6">
  <form use:enhance method="POST" action="?/saveListing">
    <Card.Header>
      <Card.Title>Manage Properties</Card.Title>
      <Card.Description>Edit the basics right here at the top.</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <Form.Field {form} name="title">
          <Form.Control let:attrs>
          <div class="grid gap-1 max-w-96">
            <Form.Label class="text-sm">Title</Form.Label>
            <Input {...attrs} id="title" type="text" class="w-full" bind:value={$formData.title} />
            <Form.FieldErrors class="text-xs" />
          </div>
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="description">
          <Form.Control let:attrs>
          <div class="grid gap-1">
            <Form.Label class="text-sm w-min" for="password">Description</Form.Label>
            <Textarea {...attrs} id="description" class="w-full" bind:value={$formData.description} />
            <Form.FieldErrors class="text-xs" />
          </div>
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="type">
          <Form.Control let:attrs>
          <div class="grid gap-1">
            <Form.Label class="text-sm" for="type">Job Type</Form.Label>
            <!--<Textarea {...attrs} id="description" type="text" class="w-full" bind:value={$formData.description} />-->
            <Select.Root type="single" bind:selected={selectValue} onSelectedChange={(v) => $formData.type = v.value} {...attrs}>
              <Select.Trigger class="w-[180px]">
                <Select.Value placeholder="Select a job type" />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <!--<Select.Label>Listing Types</Select.Label>-->
                  {#each options as option}
                    <Select.Item value={option.value} label={option.label} />
                  {/each}
                </Select.Group>
              </Select.Content>
              <Select.Input name="type" />
            </Select.Root>
            <Form.FieldErrors class="text-xs" />
          </div>
          </Form.Control>
        </Form.Field>
    </Card.Content>
    <Card.Footer class="mt-6 flex justify-end gap-6">
      <Button disabled={$isSubmitting} variant="outline" onclick={() => deleteAlertOpen = true}>
        {#if $isSubmitting}
          <LoaderCircle class="animate-spin mr-1" />
        {/if}
        Delete
      </Button>
      <Button disabled={submitting} type="submit" onclick={() => console.log("yeah!")}>
        {#if submitting}
          <LoaderCircle class="animate-spin mr-1" />
        {/if}
        Save
      </Button>
    </Card.Footer>
  </form>
</Card.Root>