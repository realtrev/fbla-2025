<script lang="ts">
  import { toast } from "svelte-sonner";
  import {
    type ColumnDef,
    type PaginationState,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
  } from "@tanstack/table-core";
  import { readable } from "svelte/store";
  import ListingActions from "../../../routes/admin/o/listings/ListingActions.svelte";
  import TablePagination from "./TablePagination.svelte";
  import ListingTypes from "../../../routes/admin/o/listings/ListingTypes.svelte";
  import { Button } from "$lib/components/ui/button";
  import {parseDateTime} from '@internationalized/date';
  import { goto } from '$app/navigation';
  import * as Table from "$lib/components/ui/table";
  import { Input } from '$lib/components/ui/input';
  import Plus from 'lucide-svelte/icons/plus';
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table";
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { Snippet } from 'svelte';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';

  let {
    data = $bindable([]),
    count = $bindable(0),
    perPage = $bindable(20),
    currentPage = $bindable(1),

    columns = [],
    class: className,
    action,

    ...props
  }: {
    data: any[],
    count?: number,
    perPage?: number,
    currentPage?: number,
    columns: ColumnDef<any, any>[],
    class?: string,

    action: Snippet,

    onrowclick?: (row: any) => void,
    onpagechange?: (page: number) => void
  } = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: perPage });
  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let columnVisibility = $state<VisibilityState>({});

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === "function") {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },
    state: {
      get pagination() {
        return pagination;
      },
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      },
      get columnVisibility() {
        return columnVisibility;
      },
    },
  });

  function pageChangeWrapper(page: number) {
    console.log(page);
    table.setPageIndex(page - 1);
    props.onpagechange?.(page);
  }

</script>

<div class="w-full px-6">
  <div class="w-full flex justify-between">
    <Input placeholder="Search..." class="max-w-60 mb-6" />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="ml-auto">
            Show Columns
            <ChevronDown class="h-4 w-4 ml-1" />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {#each table
          .getAllColumns()
          .filter((col) => col.getCanHide()) as column (column.id)}
          <DropdownMenu.CheckboxItem
            class="capitalize"
            bind:checked={() => column.getIsVisible(),
            (v) => column.toggleVisibility(!!v)}
          >
            {column.id}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    {@render action?.()}
  </div>
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row class={className} data-state={row.getIsSelected() && "selected"} onclick={() => props.onrowclick?.(row.original)}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender
                  content={cell.column.columnDef.cell}
                  context={cell.getContext()}
                />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">
              No results.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
    <div class="flex items-center justify-center space-x-4 py-4">
      <TablePagination onpagechange={pageChangeWrapper} bind:currentPage {perPage} bind:count />
    </div>
  </div>
