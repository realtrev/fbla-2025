<script lang="ts">
  import { onMount, createRawSnippet } from 'svelte';
  import ListingActions from './ListingActions.svelte';
  import Table from '$lib/components/table/Table.svelte';
  import TableSortButton from '$lib/components/table/TableSortButton.svelte';
  import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
  import * as Accordion from "$lib/components/ui/accordion";
  import * as Card from "$lib/components/ui/card";

  let {
    availableSchools = $bindable([]),
    listing
  }: {
    availableSchools: SchoolModel[];
    listing: ListingModel;
  } = $props();

  let schoolOptions = $state("all");

  let confirmedSchools = $state([]);

  $effect(() => {
    confirmedSchools = availableSchools.filter((s) => listing.confirmedSchools.includes(s.id));
  })

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Title"
        }),
//      cell: ({ row }) => {
//        const nameSnippet = createRawSnippet<[string]>((getTitle) => {
//          const title = getTitle();
//          return {
//            render: () => `<p class="hover:underline">${name}</p>`,
//          };
//        });
//
//        return renderSnippet(
//          nameSnippet,
//          row.getValue("name")
//        );
//      },
      accessorFn: row => row.name
    },
    {
      accessorKey: "location",
      header: ({ column }) =>
        renderComponent(TableSortButton, {
          onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          "aria-label": "Location"
        }),
      accessorFn: row => row.location
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return renderComponent(ListingActions, { listing, school: row.original, updateTable() {
        	console.log("table updated");
        }, });
      },
      enableHiding: false,
    }
  ];
</script>

<Card.Root class="mt-6">
  <Card.Header>
    <Card.Title>Select Schools</Card.Title>
    <Card.Description>
      Select the schools where this listing will be shown.
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <Accordion.Root type="single" bind:value={schoolOptions}>
      <Accordion.Item value="all">
        <Accordion.Trigger class="font-semibold">All Schools</Accordion.Trigger>
        <Accordion.Content>
          <Table bind:data={availableSchools} {columns} columnVisibility={{status: false}} filterColumn="title" searchPlaceholder="Search titles..." perPage={10} class="hover:cursor-pointer">
          </Table>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="verified">
        <Accordion.Trigger class="font-semibold">Accepted</Accordion.Trigger>
        <Accordion.Content>
          <Table bind:data={confirmedSchools} {columns} columnVisibility={{status: false}} filterColumn="title" searchPlaceholder="Search titles..." perPage={10} class="hover:cursor-pointer">
          </Table>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </Card.Content>
</Card.Root>