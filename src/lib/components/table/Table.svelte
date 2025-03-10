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
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table";
  import { Button } from "$lib/components/ui/button";
  import { goto } from '$app/navigation';
  import * as Table from "$lib/components/ui/table";
  import { Input } from '$lib/components/ui/input';
  import Plus from 'lucide-svelte/icons/plus';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import type { Snippet } from 'svelte';
  import ChevronDown from 'lucide-svelte/icons/chevron-down';

  import TablePagination from "./TablePagination.svelte";
  import TableSortButton from "./TableSortButton.svelte";

  let {
    data = $bindable([]),
    count = $bindable(0),
    perPage = $bindable(20),
    currentPage = $bindable(1),
    hideControls = $bindable(false),

    columnVisibility = $bindable<VisibilityState>({}),

    columns = [],
    filterColumn,
    searchPlaceholder = "Search entries...",
    class: className,
    action,

    ...props
  }: {
    data: any[],
    count?: number,
    perPage?: number,
    currentPage?: number,
    columns: ColumnDef<any, any>[],
    filterColumn?: string,
    searchPlaceholder?: string,
    hideControls?: boolean,

    columnVisibility?: VisibilityState,

    class?: string,
    action: Snippet,

    sorting?: {
      id: string,
      desc: boolean
    }[],

    onrowclick?: (row: any) => void,
    onpagechange?: (page: number) => void
  } = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: perPage });
  let sorting = $state<SortingState>(props.sorting ?? []);
  let columnFilters = $state<ColumnFiltersState>([]);

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
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
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
      totalCount = table.getFilteredRowModel().rows.length;
      currentPage = 1;
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
    }
  });

  let totalCount = $state(table.getCoreRowModel().rows.length);
  $effect(() => {
    totalCount = table.getFilteredRowModel().rows.length;
  });
  let endOfPage = $derived(Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount));

  function pageChangeWrapper(page: number) {
    console.log(page);
    table.setPageIndex(page - 1);
    props.onpagechange?.(page);
  }
</script>


{#if data !== undefined}
  <div class="w-full -z-1">
    {#if !hideControls}
    <div class="w-full flex justify-between">
      <Input placeholder={searchPlaceholder} class="max-w-60 mb-6" oninput={(e) => {
               table.getColumn(filterColumn ?? "")?.setFilterValue(e.currentTarget.value);
        }} />
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
    {/if}
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
    <div class="flex items-center justify-between space-x-4 pt-4 px-2">
      <div class="text-sm text-muted-foreground">
        {pagination.pageIndex * pagination.pageSize + 1}-{endOfPage}
        of
        {totalCount}
      </div>
      <div>
        <TablePagination onpagechange={pageChangeWrapper} bind:currentPage {perPage} bind:count={totalCount} />
      </div>
    </div>
  </div>
{/if}