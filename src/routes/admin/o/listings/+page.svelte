<script lang="ts">
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';
  import { Card } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  import { pb } from '$lib/pocketbase';
  import { toast } from 'svelte-sonner';
  import Table from '$lib/components/table/Table.svelte';
  import * as Tabs from '$lib/components/ui/tabs';
  import { createRawSnippet, onMount } from 'svelte';
  import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
  import ListingActions from './ListingActions.svelte';
  import ListingTypes from './ListingTypes.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import TableSortButton from '$lib/components/table/TableSortButton.svelte';
  import { formatDate } from '$lib/utils';

  import Loading from '$lib/components/Loading.svelte';

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

  const listingTypes = {
    "volunteer": "Volunteer",
    "full-time":"Full Time",
    "part-time": "Part Time",
    "internship": "Internship"
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Title"
        })
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return renderComponent(ListingTypes, { listingType: row.getValue("type") });
      },
      accessorFn: (row) => listingTypes[row.type],
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Type"
        }),
    },
    {
      accessorKey: "updated",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Last Updated"
        }),
      cell: ({ row }) => {
        const nameSnippet = createRawSnippet<[string]>((getName) => {
          const name = getName();
          return {
            render: () => `<div class="grid"><p>${name.split("|")[0]}</p><p class="text-xs text-muted-foreground">${name.split("|")[1]}</p></div>`,
          };
        });

        return renderSnippet(
          nameSnippet,
          formatDate(row.original.updated, true)
        );
      },
      accessorFn: row => row.updated
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


<Tabs.Root value="drafts" class="w-full">
  <div class="flex justify-between">
    <h1 class="text-lg md:text-2xl font-semibold">Listings</h1>
    <Tabs.List>
      <Tabs.Trigger value="drafts">Drafts</Tabs.Trigger>
      <Tabs.Trigger value="published">Published</Tabs.Trigger>
      <Tabs.Trigger value="archived">Archive</Tabs.Trigger>
    </Tabs.List>
  </div>
  <Tabs.Content value="drafts">
    <Card class="size-full border border-dashed mt-6 grow flex flex-col pt-6">
      {#if !listings.length}
      <div class="size-full flex items-center justify-center">
        <Loading />
      </div>
      {:else}

        <Table bind:data={listings} {columns} sorting={[{id: 'updated', desc: true}]} filterColumn="title" searchPlaceholder="Search titles..." bind:count={totalCount} bind:currentPage={page} bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/edit/" + row.id)}>
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
  </Tabs.Content>
  <Tabs.Content value="password">Change your password here.</Tabs.Content>
</Tabs.Root>