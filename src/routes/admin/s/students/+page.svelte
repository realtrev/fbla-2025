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
  import type { UserModel } from '../../../../app';

  let {
    data
  }: {
    data: {
      students: ListingModel[];
    }
  } = $props();

  let page = $state(1);
  let students = $state(data.students) as UserModel[];
  let totalCount = $state(0);
  let pageSize = $state(10);

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      accessorFn: (row) => `${row.firstName} ${row.lastName}`
    },
    {
      accessorKey: "email",
      header: "Email",
      accessorFn: (row) => row.email
    },
    {
      accessorKey: "joined",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Joined"
        }),
      cell: ({ row }) => {
        const nameSnippet = createRawSnippet<[string]>((getName) => {
          const name = getName();
          return {
            render: () => `<div class="grid"><p>${name.split("|")[0]}</p><p class="text-xs text-muted-foreground">${name.split("|")[1] ?? ""}</p></div>`,
          };
        });

        return renderSnippet(
          nameSnippet,
          formatDate(row.original.created, true)
        );
      },
      accessorFn: row => row.created
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return renderComponent(ListingActions, { id: row.id });
      },
      enableHiding: false,
    }
  ];

</script>


<div>
  <h1 class="text-lg md:text-2xl font-semibold">
    Students
  </h1>
  <p class="text-muted-foreground mt-1">
    View and manage the students in your school.
  </p>
</div>
<Card class="size-full border border-dashed mt-6 grow flex flex-col p-6">
  <Table bind:data={students} {columns} bind:count={totalCount} searchPlaceholder="Search names..." filterColumn="name" bind:currentPage={page} bind:perPage={pageSize} class="hover:cursor-pointer">
  </Table>
</Card>