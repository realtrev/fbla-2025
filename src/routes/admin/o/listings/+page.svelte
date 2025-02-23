<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { Card } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';
  import ListingTable from '$lib/components/listing-table/ListingTable.svelte';

  let page = $state(1);
  let listings = $state([]) as ListingModel[];
  let totalCount = $state(0);
  let totalPages = $state(0);
  let pageSize = $state(10);
  let loading = $state(true);

  loadListings();

  async function loadListings() {
    const resultList = await pb.collection('listings').getFullList({
//      filter: 'someField1 != someField2',
    })
    .then((result) => {
      listings = result as ListingModel[];
      totalCount = listings.length;
    })
    loading = false;
  }
</script>

<h1 class="text-lg md:text-2xl font-semibold">Listings</h1>
<Card class="size-full border border-dashed mt-6 grow flex flex-col pt-6">
  {#if loading}
  <div class="size-full flex grow items-center justify-center">
    <LoaderCircle class="animate-spin" />
  </div>
  {:else}
    {#if !listings.length}
    <div class="flex flex-col grow justify-center items-center gap-1 text-center">
      <h3 class="text-2xl font-bold tracking-tight">You have no listings</h3>
      <p class="text-muted-foreground text-sm">
        You can start sharing listings as soon as you make one.
      </p>
      <Button class="mt-4" onclick={() => { goto("/admin/o/listings/create"); toast.success("Creating new listing...")}}>Add Listing</Button>
    </div>
    {:else}
      <ListingTable bind:listings bind:count={totalCount} bind:currentPage={page} bind:perPage={pageSize} />
    {/if}
  {/if}
</Card>