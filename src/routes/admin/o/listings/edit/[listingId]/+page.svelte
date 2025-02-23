<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import EditListingForm from './EditListingForm.svelte';
  import { type FormSchema } from './editListing';

  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';

  let {
    data
  }: {
    data : {
      listing: Promise<ListingModel>,
      form: FormSchema
    }
  } = $props();

  let listing = $state(null) as ListingModel;
  let loading = $state(true);

  onMount(async() => {
    const value = await data.listing;
    listing = value;
    console.log(listing.type);
    loading = false;
  });
</script>

<div class="flex flex-col max-w-screen-md w-full mx-auto">
  <div class="flex gap-6 items-center">
    <Button
      variant="outline"
      size="icon"
      href="/admin/o/listings"
    >
      <ChevronLeft class="h-5 w-5" />
    </Button>
    <h1 class="text-lg md:text-2xl font-semibold">Edit Listing</h1>
  </div>

  {#if loading}
  <div class="size-full flex grow items-center justify-center h-96">
    <LoaderCircle class="animate-spin" />
  </div>
  {:else}
    <EditListingForm form={data.form} {listing} />
  {/if}
</div>