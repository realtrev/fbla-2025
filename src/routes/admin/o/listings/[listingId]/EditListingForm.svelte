<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { buttonVariants } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
  import * as Form from "$lib/components/ui/form";
  import * as Card from "$lib/components/ui/card";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { editSchema, type FormSchema } from './editListing';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { superForm } from "sveltekit-superforms";
	import { Turnstile } from 'svelte-turnstile';
  import { PUBLIC_CF_SITEKEY } from '$env/static/public'
  import { deserialize } from '$app/forms';
  import Loading from '$lib/components/Loading.svelte';
  import Combobox from '$lib/components/Combobox.svelte';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { buildDebouncer, postAction } from '$lib/utils';
  import { goto } from '$app/navigation';
  import type { ListingModel, OrganizationModel, SchoolModel } from '../../../../../app';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import Save from 'lucide-svelte/icons/save';
  import * as Tabs from "$lib/components/ui/tabs";
  import JobListing from './JobListing.svelte';

  let {
    listing,
    form: givenForm,
    availableSchools,
    organization
  }: {
    listing: ListingModel;
    form: FormSchema;
    availableSchools: SchoolModel[];
    organization: OrganizationModel;
  } = $props();

  let submitting = $state(false);
  let loaded = false;
  let cloudSync = $state(true);
  let formBody;
  let debounce: Function;

  const form = superForm(givenForm, {
    validators: zodClient(editSchema),
    autoFocusOnError: false,
    validationMethod: 'onsubmit',
    taintedMessage: 'Are you sure you want to leave?',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      if (result.type === "success") {
        cancel();
        const matches = JSON.stringify($formData) == JSON.stringify(result?.data?.form?.data);
        if (matches) {
          $tainted = {};
          toast.success("Saved listing.");
          cloudSync = true;
          return;
        }
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
    onChange: () => {
      listing.title = $formData.title;
      listing.description = $formData.description;
      listing.type = $formData.type;
      listing.location = $formData.location;

      if (isTainted()) {
        cloudSync = false;
        debounce($formData);
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

  const { form: formData, enhance, isTainted, errors, tainted } = form;

  const options = [
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
    },
    {
      value: "volunteer",
      label: "Volunteer"
    },
  ];

  let deleteAlertOpen = $state(false);

  $formData.title = listing.title;
  $formData.description = listing.description;
  $formData.type = listing.type;
  $formData.location = listing.location;
  $tainted = {};

  debounce = buildDebouncer((data) => {
    console.log("debounced", data);
    formBody.requestSubmit();
  }, 1000);

  $effect(() => {
    if (loaded) {
      return;
    }
    if ($formData.type === "volunteer") {
      $tainted.type = true;
    }
  });

  const triggerContent = $derived(
    options.find((f) => f.value === $formData.type)?.label ?? "Select a job type"
  );
</script>

<div class="flex justify-between items-center">
  <div class="flex gap-6 items-center">
    <Button
      variant="outline"
      size="icon"
      href="/admin/o/listings"
    >
      <ChevronLeft class="h-5 w-5" />
    </Button>
    <h1 class="text-lg md:text-2xl font-semibold line-clamp-1">{listing.title}</h1>
  </div>
  <div class="flex gap-4">
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger disabled={!cloudSync} class={buttonVariants({ variant: "outline", size: "icon" })}
                         onclick={() => { cloudSync = false; formBody.requestSubmit() }}
        >
          {#if cloudSync == false}
            <LoaderCircle class="animate-spin" />
          {:else}
            <Save class="size-4" />
          {/if}
        </Tooltip.Trigger
        >
        <Tooltip.Content>
          <p>Save</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
    <Button>
      Publish
    </Button>
  </div>
</div>

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

<form use:enhance method="POST" action="?/saveListing" bind:this={formBody}>
  <Card.Root class="mt-6">
    <Card.Header>
      <Card.Title>Edit Properties</Card.Title>
      <Card.Description>
        Edit the properties of this listing.
      </Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <Tabs.Root value="edit" class="w-full">
        <Tabs.List>
          <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="edit">
          <div class="flex flex-col gap-4">
            <Form.Field {form} name="title">
              <Form.Control>
                {#snippet children({ props })}
                  <div class="grid gap-1 max-w-96">
                    <Form.Label class="text-sm">Title</Form.Label>
                    <Input {...props} id="title" type="text" class="w-full" bind:value={$formData.title} />
                    <Form.FieldErrors class="text-xs" />
                  </div>
                {/snippet}
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="location">
              <Form.Control>
                {#snippet children({ props })}
                  <div class="grid gap-1 max-w-96">
                    <Form.Label class="text-sm">Location</Form.Label>
                    <Input {...props} id="title" type="text" class="w-full" bind:value={$formData.location} />
                    <Form.FieldErrors class="text-xs" />
                  </div>
                {/snippet}
              </Form.Control>
            </Form.Field>

            <Form.Field {form} name="type">
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label class="text-sm" for="type">Type</Form.Label>
                  <div class="grid gap-1">
                    <Select.Root {...props} type="single" name="type" bind:value={$formData.type}>
                      <Select.Trigger class="w-[180px]">
                        {triggerContent}
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          <Select.GroupHeading>Listing Type</Select.GroupHeading>
                          {#each options as option}
                            <Select.Item value={option.value} label={option.label}
                            >{option.label}</Select.Item>
                          {/each}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>
                {/snippet}
              </Form.Control>
              <Form.FieldErrors class="text-xs" />
            </Form.Field>

            <Form.Field {form} name="description">
              <Form.Control>
                {#snippet children({ props })}
                  <div class="grid gap-1">
                    <Form.Label class="text-sm" for="password">Markdown Description</Form.Label>
                    <Textarea {...props} id="description" class="w-full h-[300px]" bind:value={$formData.description} />
                    <Form.FieldErrors class="text-xs" />
                  </div>
                {/snippet}
              </Form.Control>
            </Form.Field>
          </div>
        </Tabs.Content>
        <Tabs.Content value="preview">
          <div class="mb-6">
            <JobListing {listing} {organization} />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Card.Content>
  </Card.Root>
</form>
