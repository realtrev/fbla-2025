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
      applications: ListingModel[];
    }
  } = $props();

  let page = $state(1);
  let applications = $state([]) as ListingModel[];
  let totalCount = $state(0);
  let totalPages = $state(0);
  let pageSize = $state(10);

  async function loadListings() {
    const resultList = await pb.collection('applications').getFullList({
      expand: 'listing,student',
    })
    .then((result) => {
      applications = result as ListingModel[];
      totalCount = applications.length;
      console
    })
  }

  console.log(data.applications);

  const columns = [
    {
      accessorKey: "student",
      header: "Student",
      cell: ({ row }) => {
        const nameSnippet = createRawSnippet<[string]>((getName) => {
          const name = getName();
          return {
            render: () => `<div>${name}</div>`,
          };
        });

        return renderSnippet(
          nameSnippet,
          `${row.original.expand.student.firstName} ${row.original.expand.student.lastName}`
        );
      }
    },
    {
      accessorKey: "listing",
      header: "Listing",
      cell: ({ row }) => {
        const nameSnippet = createRawSnippet<[string]>((getName) => {
          const name = getName();
          return {
            render: () => `<div>${name}</div>`,
          };
        });

        return renderSnippet(
          nameSnippet,
          `${row.original.expand.student.firstName} ${row.original.expand.student.lastName}`
        );
      }
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
    totalCount = applications.length;
    applications = data.applications;
  });
</script>

<h1 class="text-lg md:text-2xl font-semibold">Applications</h1>
<Card class="size-full border border-dashed mt-6 grow flex flex-col pt-6">
  <Table bind:data={applications} {columns} bind:count={totalCount} bind:currentPage={page} bind:perPage={pageSize} class="hover:cursor-pointer">
  </Table>
</Card>