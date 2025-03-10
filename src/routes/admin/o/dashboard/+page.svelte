<script lang="ts">
  import { onMount } from 'svelte';
  import { pb } from '$lib/pocketbase';
  import { getColumns } from '../listings/listingTableLayout';
  import { goto } from '$app/navigation';
  import Table from '$lib/components/table/Table.svelte';

  let loading = $state(true);
  let listings = $state([]) as ListingModel[];

  let applicationCount = $state(0);

  onMount(async () => {
    await loadListings();

    loading = false;
  });

async function loadListings() {
  await pb.collection('listings').getFullList({
  //      filter: 'someField1 != someField2',
  })
  .then((result) => {
    if (result) {
      listings = result as ListingModel[];
    }
  })
  .catch((e) => {
    console.log(e);
  })
}

const listingColumns = getColumns(loadListings);

const stats = $derived({
  "Total Listings": listings.length,
  "Published Listings": listings.filter((l) => l.published && !l.archived).length,
});
</script>

<h1 class="text-2xl font-semibold">Dashboard</h1>
<p class="mt-1 text-muted-foreground">View all your stats in one place.</p>


<div class="w-full grid gap-6 md:grid-cols-3 grid-cols-1 lg:grid-cols-4 mt-6">
  {#each Object.entries(stats) as [key, value]}
    <div class="bg-white border border-border hover:border-primary transition-all hover:shadow group rounded-lg p-6 max-h-28">
      <p class="font-semibold text-muted-foreground">
        {key}
      </p>
      <p class="group-hover:text-primary transition text-2xl md:text-3xl font-semibold">
        {value}
      </p>
    </div>
  {/each}
  <div class="col-span-2 bg-white border border-border rounded-lg p-6">
    <div>
      <p class="mb-4 font-semibold text-lg">
        Listings
      </p>
      <Table bind:data={listings} columns={listingColumns} columnVisibility={{status: false}} sorting={[{id: 'updated', desc: true}]} hideControls={true} perPage={5} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/" + row.id)}>
      </Table>
    </div>
  </div>
</div>