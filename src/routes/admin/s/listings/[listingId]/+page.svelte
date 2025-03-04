<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import EditListingForm from './PreviewListing.svelte';

  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import type { ListingModel, SchoolModel } from '../../../../../app';
  import PreviewListing from './PreviewListing.svelte';

  let {
    data
  }: {
    data : {
      listing: ListingModel,
      organization,
    }
  } = $props();

  let listing = $state<ListingModel>(data.listing);
  let loading = $state(true);

  onMount(async() => {
    loading = false;
  });
</script>

<div class="flex flex-col max-w-screen-md w-full mx-auto">
  {#if loading}
  <div class="size-full flex grow items-center justify-center h-96">
    <LoaderCircle class="animate-spin" />
  </div>
  {:else}
    <PreviewListing {listing} organization={data.organization} />
  {/if}
</div>