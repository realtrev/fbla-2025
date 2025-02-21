<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, TrashIcon } from 'lucide-svelte';
  import TextInput from '$lib/components/TextInput.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import SelectInput from '$lib/components/SelectInput.svelte';
  import  { submitForm } from '$lib/utils';
  import { onMount } from 'svelte';
  import Loading from '$lib/components/Loading.svelte';
  import { createDialog } from 'svelte-headlessui';
  import Transition from 'svelte-transition';
  import { pb } from '$lib/pocketbase';

  let {
      data
    }: {
      data: {
        listing: ListingModel
      }
    } = $props();

  let error = $state(false);
  let listing = $state({} as ListingModel);
  let jobTitle = $state("");
  let jobDescription = $state("");
  let jobType = $state("");
  let saveStatus = $state("Save Draft");

	const deleteConfirmation = createDialog({ label: 'Delete Confirmation' });
	const deletedSuccess = createDialog({ label: 'Deleted Success' });

  function validateForm(e: Event) {
    if (saveStatus !== "Save Draft") {
      return;
    }

    e.preventDefault();
    const inputs = Array.from(document.querySelectorAll("#form [data-form-element]"));

    submitForm(inputs, e, formSuccess, formFailed);

    function formFailed() {
      console.log("failed");
    }

    async function formSuccess() {
      saveStatus = "Saving...";
        const saved = await pb.collection("listings").update(listing?.id, {
        title: jobTitle,
        description: jobDescription,
        type: jobType
      });
      if (saved) {
        saveStatus = "Saved";
        setTimeout(() => {
            saveStatus = "Save Draft";
        }, 3000);
      }
    }
  }

  async function deleteListing() {
      // deleted
      deleteConfirmation.close();

      if (listing) {
        const deleted = await pb.collection("listings").delete(listing?.id);
        console.log(deleted);
        if (deleted) {
          deletedSuccess.open();
        }
      }
  }

  onMount(async () => {
    let value;
    try {
      value = await data.listing;
    } catch(e) {
      error = true;
      return;
    }
    console.log(value);

    listing = value;
    jobTitle = value?.title;
    jobDescription = value?.description;
    jobType = value?.type;

    console.log(jobTitle);
  });
</script>

<div class="relative z-10">
	<Transition show={$deletedSuccess.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<button class="fixed inset-0 bg-black/25" aria-label="close"></button>
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						use:deletedSuccess.modal
					>
						<h3 class="text-lg leading-6 font-medium text-gray-900">Success!</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500 font-normal">
                Successfully deleted job listing.
							</p>
						</div>

						<div class="mt-4 flex justify-between">
              <Button label="Back to Listings" color="surface" link="/admin/o/listings" />
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

<div class="relative z-10">
	<Transition show={$deleteConfirmation.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<button class="fixed inset-0 bg-black/25" aria-label="close" onclick={deleteConfirmation.close}></button>
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						use:deleteConfirmation.modal
					>
						<h3 class="text-lg leading-6 font-medium text-gray-900">Listing deletion!</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500 font-normal">
								Are you sure you want to delete this listing. This action is irreversible
							</p>
						</div>

						<div class="mt-4 flex justify-between">
              <Button label="Go Back" color="surface" onclick={deleteConfirmation.close} />
              <Button label="Delete This" color="red" onclick={deleteListing} />
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

{#if error}
  <div class="">
    404 not found
  </div>
{:else}
{#await data.listing}
  <div class="w-full h-96 flex items-center justify-center">
    <Loading />
  </div>
{:then}
  <div class="p-5">
    <div class="flex gap-2 items-center justify-between">
      <div class="flex gap-2 items-center">
        <a href="/admin/o/listings" class="hover:bg-surface-0 p-2.5 rounded-full transition" >
          <ArrowLeftIcon class="w-6 h-6 stroke-2" />
        </a>
        <h1 class="text-2xl font-medium">Edit Listing</h1>
      </div>

      <div class="flex gap-x-2">
        <Button label="Discard" onclick={deleteConfirmation.open} color="surface" leftIcon={TrashIcon} class="font-light" />
        <Button label={saveStatus} onclick={validateForm} leftIcon={SaveIcon} color="surface" class="font-light" />
        <Button label="Publish" leftIcon={ArrowRightIcon} class="font-light" />
      </div>
    </div>
    <form id="form" class="max-w-screen-sm mt-5">
        <TextInput
        label="Job Title"
        bind:value={jobTitle}
        required
        maxlength={50}
        showcounter
        />
        <TextArea
          label="Job Description"
          lines=3
          class="mt-2"
          bind:value={jobDescription}
          required
          maxlength={400}
          showcounter
          onchange={(e) => console.log(jobDescription)}
          />
        <SelectInput
          label="Job Type"
          class="mt-2"
          options={[{id: "full-time", value: "Full Time"}, {id: "part-time", value: "Part Time"}, {id: "volunteer", value: "Volunteer"}, {id: "internship", value: "Internship"}]}
          placeholder="Pick One"
          bind:value={jobType}
          required
          />
      </form>
  </div>
{/await}
{/if}