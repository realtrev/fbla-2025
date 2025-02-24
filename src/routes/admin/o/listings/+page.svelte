<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { Card } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  import { pb } from '$lib/pocketbase';
  import { toast } from 'svelte-sonner';
  import Table from '$lib/components/table/Table.svelte';
  import { createRawSnippet, onMount } from 'svelte';
  import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
  import ListingActions from './ListingActions.svelte';
  import ListingTypes from './ListingTypes.svelte';
  import Plus from 'lucide-svelte/icons/plus';

  let {
    data
  }: {
    data: {
      listings: ListingModel[];
    }
  } = $props();

  let page = $state(1);
  let listings = $state([]) as ListingModel[];
  let totalCount = $state(0);
  let totalPages = $state(0);
  let pageSize = $state(10);

  async function loadListings() {
    const resultList = await pb.collection('listings').getFullList({
//      filter: 'someField1 != someField2',
    })
    .then((result) => {
      listings = result as ListingModel[];
      totalCount = listings.length;
    })
  }

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return renderComponent(ListingTypes, { listingType: row.getValue('type') });
      }
    },
    {
      accessorKey: "updated",
      header: "Last Updated",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return renderComponent(ListingActions, { id: row.id });
      },
      enableHiding: false,
    }
  ];

  loadListings();

  onMount(() => {
    totalCount = listings.length;
    listings = data.listings;
  });
</script>

<h1 class="text-lg md:text-2xl font-semibold">Listings</h1>
<Card class="size-full border border-dashed mt-6 grow flex flex-col pt-6">
  {#if !listings.length}
  <div class="flex flex-col grow justify-center items-center gap-1 text-center">
    <h3 class="text-2xl font-bold tracking-tight">You have no listings</h3>
    <p class="text-muted-foreground text-sm">
      You can start sharing listings as soon as you make one.
    </p>
    <Button class="mt-4" onclick={() => { goto("/admin/o/listings/create"); toast.success("Creating new listing...")}}>Add Listing</Button>
  </div>
  {:else}
    <Table bind:data={listings} {columns} bind:count={totalCount} bind:currentPage={page} bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/edit/" + row.id)}>
      {#snippet action()}
        <Button
          href="/admin/o/listings/create"
          class="ml-4"
        >
          <Plus class="h-5 w-5" />
          Create
        </Button>
      {/snippet}
    </Table>
  {/if}
</Card>