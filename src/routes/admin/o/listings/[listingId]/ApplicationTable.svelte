<script lang="ts">
  import { onMount, createRawSnippet } from 'svelte';
  import ListingActions from './ListingActions.svelte';
  import Table from '$lib/components/table/Table.svelte';
  import TableSortButton from '$lib/components/table/TableSortButton.svelte';
  import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
  import * as Accordion from "$lib/components/ui/accordion";
  import * as Card from "$lib/components/ui/card";
  import { formatDate } from '$lib/utils';

  let {
    applications = $bindable([]),
    listing
  }: {
    applications: ApplicationModel[];
    listing: ListingModel;
  } = $props();

  console.log(applications);

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Name"
        }),
      accessorFn: (row) => row.expand.student.firstName + " " + row.expand.student.lastName
    },
    {
      accessorKey: "status",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Status"
        }),
      accessorFn: row => row.status
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
  ];
</script>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title>Applications</Card.Title>
    <Card.Description>
      View applications from students for this listing.
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <Table bind:data={applications} {columns} filterColumn="name" searchPlaceholder="Search names..." perPage={10} class="hover:cursor-pointer">
    </Table>
  </Card.Content>
</Card.Root>