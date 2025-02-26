<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import EditListingForm from './EditListingForm.svelte';
  import { type FormSchema } from './editListing';

  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import type { ListingModel, SchoolModel } from '../../../../../app';

  let {
    data
  }: {
    data : {
      listing: ListingModel,
      availableSchools: SchoolModel[],
      form: FormSchema,
      organization
    }
  } = $props();

  let listing = $state<ListingModel>(data.listing);
  let availableSchools = $state<SchoolModel[]>(data.availableSchools);
  let loading = $state(true);

  onMount(async() => {
    console.log(listing.type);
    loading = false;
  });
</script>

<div class="flex flex-col max-w-screen-md w-full mx-auto">
  {#if loading}
  <div class="size-full flex grow items-center justify-center h-96">
    <LoaderCircle class="animate-spin" />
  </div>
  {:else}
    <EditListingForm form={data.form} {listing} {availableSchools} organization={data.organization} />
  {/if}
</div>