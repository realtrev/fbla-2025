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
      organization,
      applications
    }
  } = $props();

  let listing = $state<ListingModel>(data.listing);
  let availableSchools = $state<SchoolModel[]>(data.availableSchools);
  let loading = $state(true);

  onMount(async() => {
    loading = false;

    pb.collection('listings').subscribe(listing.id, function (e) {
      console.log(e.action);
      console.log(e.record);

      if (e.record && e.record.confirmedSchools && e.record.requestedSchools) {
        listing.confirmedSchools = e.record.confirmedSchools;
        listing.requestedSchools = e.record.requestedSchools;
      }
    });
  });

  
</script>

<div class="flex flex-col max-w-screen-md w-full mx-auto">
  {#if loading}
  <div class="size-full flex grow items-center justify-center h-96">
    <LoaderCircle class="animate-spin" />
  </div>
  {:else}
    <EditListingForm form={data.form} {listing} {availableSchools} applications={data.applications} organization={data.organization} />
  {/if}
</div>