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
  import TableSortButton from '$lib/components/table/TableSortButton.svelte';
  import { formatDate } from '$lib/utils';

  let {
    data
  }: {
    data: {
      applications: ListingModel[];
    }
  } = $props();

  let page = $state(1);
  let applications = $state([]) as ListingModel[];
  let totalCount = $state(0);
  let totalPages = $state(0);
  let pageSize = $state(10);

  console.log(data.applications);

  const columns = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return renderComponent(ListingTypes, { listingType: row.getValue('status') });
      }
    },
    {
      accessorKey: "listing",
      header: "Job Title",
      accessorFn: (row) =>  row.expand.listing.title
    },
    {
      accessorKey: "organization",
      header: "Organization",
      accessorFn: (row) => row.expand.listing.expand.organization.name
    },
    {
      accessorKey: "submitted",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Submitted"
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
          formatDate(row.original.submitted, true)
        );
      },
      accessorFn: row => row.submitted
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return renderComponent(ListingActions, { id: row.id });
      },
      enableHiding: false,
    }
  ];

  onMount(() => {
    totalCount = applications.length;
    applications = data.applications;
  });
</script>


<div>
  <h1 class="text-lg md:text-2xl font-semibold">
    Applications
  </h1>
  <p class="text-muted-foreground mt-1">
    View your outgoing applications.
  </p>
</div>
<Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
  <Table bind:data={applications} {columns} bind:count={totalCount} filterColumn="listing" bind:currentPage={page} bind:perPage={pageSize} class="hover:cursor-pointer">
  </Table>
</Card>