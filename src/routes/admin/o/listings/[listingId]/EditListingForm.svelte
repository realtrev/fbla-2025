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
  import { buildDebouncer, postAction, formatDate } from '$lib/utils';
  import { goto } from '$app/navigation';
  import type { ListingModel, OrganizationModel, SchoolModel } from '../../../../../app';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import Cloud from 'lucide-svelte/icons/cloud';
  import CloudUpload from 'lucide-svelte/icons/cloud-upload';
  import Save from 'lucide-svelte/icons/save';
  import * as Tabs from "$lib/components/ui/tabs";
  import JobListing from '$lib/components/JobListing.svelte';
  import SchoolTables from './SchoolTables.svelte';
  import ApplicationTable from './ApplicationTable.svelte';

  let {
    listing,
    form: givenForm,
    availableSchools,
    organization,
    applications
  }: {
    listing: ListingModel;
    form: FormSchema;
    availableSchools: SchoolModel[];
    organization: OrganizationModel;
    applications: ApplicationModel[];
  } = $props();

  let tab = $state("edit");
  let schoolOptions = $state("all");

  if (listing.published) {
    tab = "schools";
  }

  let cloudSync = $state(true);
  let formBody;
  let debounce: Function;

  const form = superForm(givenForm, {
    validators: zodClient(editSchema),
    autoFocusOnError: false,
    validationMethod: 'oninput',
    taintedMessage: 'Are you sure you want to leave?',
    onSubmit: ({ action }) => {
      submitting = true;
    },
    onResult: ({ result, formElement, cancel }) => {
      console.log("saved", result);
      if (result.type === "success") {
        cancel();
        const matches = JSON.stringify($formData) == JSON.stringify(result?.data?.form?.data);
        if (matches) {
          $tainted = {};
          cloudSync = true;
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
      } else {
        toast.error("Couldn't save listing");
      }
    },
    onChange: () => {
      if ("type" in $tainted) {
        $tainted.type = true;
      }

      listing.title = $formData.title;
      listing.description = $formData.description;
      listing.type = $formData.type;
      listing.location = $formData.location;
      listing.thumbnail = $formData.thumbnail;

      if (isTainted()) {
        cloudSync = false;
        debounce($formData);
      }
    },
    resetForm: () => false
  });

  let submitting = $state(false);
  const deleteListing = postAction("??/deleteListing", {
    onResult: ({ action }) => {
      toast.success("Deleted listing.");
      goto("/admin/o/listings");
    }
  });
  const { isSubmitting } = deleteListing;

  let publishingListing = $state(false);
  const publishListing = postAction("??/publishListing", {
    onSubmit: () => {
      publishingListing = true;
      publishAlertOpen = false;
    },
    onResult: ({ action }) => {
      console.log(action);

      if (action.type === "success") {
        toast.success("Published listing.");
        tab = "schools";
        listing.published = true;
      }
      publishingListing = false;
    }
  });

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
  let publishAlertOpen = $state(false);

  $formData.title = listing.title;
  $formData.description = listing.description;
  $formData.type = listing.type;
  $formData.location = listing.location;
  $formData.thumbnail = listing.thumbnail;
  $tainted = {};

  debounce = buildDebouncer((data) => {
    if (formBody) {
      formBody.requestSubmit();
    }
  }, 1000);

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
  </div>

  <div class="flex gap-4 items-center">
    <div class="text-sm flex gap-1 text-muted-foreground items-center">
      {#if cloudSync === false}
          <CloudUpload class="size-4" />
          Saving...
      {:else}
          <Cloud class="size-4" />
          Saved
      {/if}
    </div>
    <Tabs.Root class="w-full sm:block hidden" bind:value={tab}>
      <Tabs.List>
        {#if !listing.published}
          <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
        {/if}
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        {#if !listing.archived && listing.published}
          <Tabs.Trigger value="schools">Schools</Tabs.Trigger>
        {/if}
        <Tabs.Trigger value="applications">Applications</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
    {#if !listing.published}
      <Button disabled={publishingListing} onclick={() => publishAlertOpen = true}>
        {#if publishingListing}
          <Loading />
        {/if}
        Publish
      </Button>
    {/if}
    {#if listing.published}
    <Button disabled={publishingListing} onclick={() => publishAlertOpen = true}>
      {#if publishingListing}
        <Loading />
      {/if}
      Archive
    </Button>
    {/if}
  </div>
</div>

<Tabs.Root class="mt-6 w-full sm:hidden block" bind:value={tab}>
  <Tabs.List class="grid w-full grid-cols-2">
    <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
    <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>

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

<AlertDialog.Root bind:open={publishAlertOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. You cannot edit a published listing. Make sure you have previewed your listing before publishing.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={publishListing.submit}>Publish</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<form use:enhance method="POST" action="?/saveListing" bind:this={formBody}>
  <Tabs.Root class="w-full" bind:value={tab}>
    <Tabs.Content value="edit">
      <Card.Root class="mt-6">
        <Card.Header>
          <Card.Title>Manage Listing</Card.Title>
          <Card.Description>
            Edit the properties of this listing.
          </Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Form.Field {form} name="title" class="lg:col-span-2 col-span-1">
                <Form.Control>
                  {#snippet children({ props })}
                    <div class="grid gap-1 w-full">
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
                    <div class="grid gap-1 w-full">
                      <Form.Label class="text-sm">Location</Form.Label>
                      <Input {...props} id="title" type="text" class="w-full" bind:value={$formData.location} />
                      <Form.FieldErrors class="text-xs" />
                    </div>
                  {/snippet}
                </Form.Control>
              </Form.Field>

              <Form.Field {form} name="thumbnail" class="col-span-2">
                <Form.Control>
                  {#snippet children({ props })}
                    <div class="grid gap-1 w-full">
                      <Form.Label class="text-sm">Thumbnail Image URL</Form.Label>
                      <Input {...props} id="title" type="text" class="w-full" bind:value={$formData.thumbnail} />
                      <Form.FieldErrors class="text-xs" />
                    </div>
                  {/snippet}
                </Form.Control>
              </Form.Field>

              <Form.Field {form} name="type">
                <Form.Control>
                  {#snippet children({ props })}
                    <div class="grid gap-1">
                      <Form.Label class="text-sm" for="type">Type</Form.Label>
                      <Select.Root {...props} type="single" name="type" bind:value={$formData.type}>
                        <Select.Trigger class="w-full">
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
            </div>

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
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="preview">
      <div class="mb-6">
        <JobListing {listing} {organization} />
      </div>
    </Tabs.Content>
    <Tabs.Content value="schools">
      <SchoolTables bind:availableSchools={availableSchools} {listing} />
    </Tabs.Content>
    <Tabs.Content value="applications">
      <ApplicationTable bind:applications={applications} {listing} />
    </Tabs.Content>
  </Tabs.Root>
</form>
