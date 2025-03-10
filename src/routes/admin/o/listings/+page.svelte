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
  import type { ListingModel } from '../../../../app';

  let {
    data
  }: {
    data: {
      listings: ListingModel[];
    }
  } = $props();

  let page = $state("all");
  let listings = $state([]) as ListingModel[];
  let totalCount = $state(0);
  let totalPages = $state(0);
  let pageSize = $state(10);

//  if (data.listings) {
//    listings = data.listings;
//  }

  async function loadListings() {
    const resultList = await pb.collection('listings').getFullList({
//      filter: 'someField1 != someField2',
    })
    .then((result) => {
      if (result) {
        listings = result as ListingModel[];
        totalCount = listings.length;
      }
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
        }),
      cell: ({ row }) => {
        const nameSnippet = createRawSnippet<[string]>((getTitle) => {
          const title = getTitle();
          return {
            render: () => `<p class="hover:underline">${title}</p>`,
          };
        });

        return renderSnippet(
          nameSnippet,
          row.getValue("title")
        );
      },
      accessorFn: row => row.title
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
      accessorKey: "status",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Status"
        }),
      cell: ({ row }) => {
        return renderComponent(ListingTypes, { listingType: row.getValue("status") });
      },
      accessorFn: row => row.archived ? "Archived" : row.published ? "Published" : "Draft"
    },
    {
      accessorKey: "updated",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Last Edited"
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
        return renderComponent(ListingActions, { listing: row.original, updateTable: loadListings });
      },
      enableHiding: false,
    }
  ];

  loadListings();

  let draftListings = $state();
  let publishedListings = $state();
  let archivedListings = $state();

  $effect(() => {
    draftListings = listings.filter((listing) => listing.published === false && listing.archived === false);
    publishedListings = listings.filter((listing) => listing.published === true && listing.archived === false);
    archivedListings = listings.filter((listing) => listing.archived === true);
  });

  const tabTitlesAndDescriptions = {
    all: {
      title: "All Listings",
      description: "Everything in your organization."
    },
    drafts: {
      title: "Drafts",
      description: "Listings that are not yet published."
    },
    published: {
      title: "Published",
      description: "These are visible to students."
    },
    archived: {
      title: "Archived",
      description: "These cannot be viewed by students."
    }
  };
</script>


<Tabs.Root bind:value={page} class="w-full">
  <div class="flex justify-between">
    <div>
      <h1 class="text-lg md:text-2xl font-semibold">
        {tabTitlesAndDescriptions[page].title}
      </h1>
      <p class="text-muted-foreground mt-1">
        {tabTitlesAndDescriptions[page].description}
      </p>
    </div>
    <Tabs.List class="md:block hidden">
      <Tabs.Trigger value="all">All</Tabs.Trigger>
      <Tabs.Trigger value="drafts">Drafts</Tabs.Trigger>
      <Tabs.Trigger value="published">Published</Tabs.Trigger>
      <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
    </Tabs.List>
  </div>
  <Tabs.List class="md:hidden mt-6 grid grid-cols-4">
    <Tabs.Trigger class="col-span-1" value="all">All</Tabs.Trigger>
    <Tabs.Trigger class="col-span-1" value="drafts">Drafts</Tabs.Trigger>
    <Tabs.Trigger class="col-span-1" value="published">Published</Tabs.Trigger>
    <Tabs.Trigger class="col-span-1" value="archived">Archived</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="all">
    <Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
      {#if !listings.length}
        <div class="size-full flex items-center justify-center">
          <Loading />
        </div>
      {:else}
        <Table bind:data={listings} {columns} sorting={[{id: 'updated', desc: true}]} filterColumn="title" searchPlaceholder="Search titles..." bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/" + row.id)}>
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
  <Tabs.Content value="drafts">
    <Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
      {#if !listings.length}
      <div class="size-full flex items-center justify-center">
        <Loading />
      </div>
      {:else}
        <Table bind:data={draftListings} {columns} columnVisibility={{status: false}} sorting={[{id: 'updated', desc: true}]} filterColumn="title" searchPlaceholder="Search titles..." bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/" + row.id)}>
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
  <Tabs.Content value="published">
    <Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
      {#if !listings.length}
        <div class="size-full flex items-center justify-center">
          <Loading />
        </div>
      {:else}
        <Table bind:data={publishedListings} {columns} columnVisibility={{status: false}} sorting={[{id: 'updated', desc: true}]} filterColumn="title" searchPlaceholder="Search titles..." bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/" + row.id)}>
        </Table>
      {/if}
    </Card>
  </Tabs.Content>
  <Tabs.Content value="archived">
    <Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
      {#if !listings.length}
        <div class="size-full flex items-center justify-center">
          <Loading />
        </div>
      {:else}
        <Table bind:data={archivedListings} {columns} columnVisibility={{status: false}} sorting={[{id: 'updated', desc: true}]} filterColumn="title" searchPlaceholder="Search titles..." bind:perPage={pageSize} class="hover:cursor-pointer" onrowclick={(row) => goto("/admin/o/listings/" + row.id)}>
        </Table>
      {/if}
    </Card>
  </Tabs.Content>
</Tabs.Root>