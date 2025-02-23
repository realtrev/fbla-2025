<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender } from "svelte-headless-table";
  import { toast } from "svelte-sonner";
  import { addPagination } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import TableActions from "./TableActions.svelte";
  import TablePagination from "./TablePagination.svelte";
  import ListingTypes from "./ListingTypes.svelte";
  import { Button } from "$lib/components/ui/button";
  import {parseDateTime} from '@internationalized/date';
  import { goto } from '$app/navigation';
  import { Input } from '$lib/components/ui/input';
  import Plus from 'lucide-svelte/icons/plus';

  let {
    listings = $bindable([]),
    count = $bindable(0),
    perPage = $bindable(20),
    currentPage = $bindable(1)
  }: {
    listings: ListingModel[],
    count?: number,
    perPage?: number,
    currentPage?: number
  } = $props();

  const table = createTable(readable(listings), {
    page: addPagination({
      initialPageIndex: currentPage,
      initialPageSize: perPage,
    }),
  });

  const columns = table.createColumns([
    table.column({
      accessor: "title",
      header: "Title",
    }),
    table.column({
      accessor: "description",
      header: "Description",
    }),
    table.column({
      accessor: "type",
      header: "Type",
      cell: ({ value }) => {
        return createRender(ListingTypes, { listingType: value });
      },
    }),
    table.column({
      accessor: "updated",
      header: "Last Updated",
      cell: ({ value }) => {
        const v = value.split(".")[0].split(" ").join("T");
        const time = parseDateTime(v);
        return `${time.month}/${time.day}/${time.year} ${time.hour}:${time.minute.toString().padStart(2, "0")}`;
      }
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(TableActions, { id: value });
      },
    }),
  ]);

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>

<div class="w-full px-6">
  <div class="w-full flex justify-between">
    <Input placeholder="Search..." class="max-w-60 mb-6" />
    <Button onclick={() => { goto("/admin/o/listings/create"); toast.success("Creating new listing...")}}>
      <Plus class="size-5 mr-1" />
      Create
    </Button>
  </div>
  <div class="rounded-md border w-full">
    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
                  <Table.Head {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs} class="hover:cursor-pointer">
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs} on:click={() => {goto("/admin/o/listings/edit/" + row.cells[4].value)}}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
    </div>
    <div class="flex items-center justify-center space-x-4 py-4">
      <TablePagination bind:count bind:perPage bind:page={$pageIndex} />
    </div>
  </div>
