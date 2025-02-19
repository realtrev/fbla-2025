<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, TrashIcon } from 'lucide-svelte';
  import TextInput from '$lib/components/TextInput.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import SelectInput from '$lib/components/SelectInput.svelte';
  import  { submitForm } from '$lib/utils';
  import { onMount } from 'svelte';
  import Loading from '$lib/components/Loading.svelte';

  let {
      data
    }: {
      data: {
        listing: ListingModel
      }
    } = $props();

  let jobTitle = $state("");
  let jobDescription = $state("");
  let jobType = $state("");

  function validateForm(e: Event) {
    e.preventDefault();
    const inputs = Array.from(document.querySelectorAll("#form [data-form-element]"));

    submitForm(inputs, e, formSuccess, formFailed);

    function formFailed() {
      console.log("failed");
    }

    function formSuccess() {
      console.log("success");
    }
  }

  onMount(async () => {
    const value = await data.listing;
    console.log(value);

    jobTitle = value?.title;
    jobDescription = value?.description;
    jobType = value?.type;

    console.log(jobTitle);
  })
</script>

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
        <Button label="Discard" onclick={validateForm} color="surface" leftIcon={TrashIcon} class="font-light" />
        <Button label="Save as Draft" leftIcon={SaveIcon} color="surface" class="font-light" />
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