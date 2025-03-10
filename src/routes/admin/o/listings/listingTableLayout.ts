import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
import TableSortButton from '$lib/components/table/TableSortButton.svelte';
import ListingTypes from './ListingTypes.svelte';
import ListingActions from './ListingActions.svelte';
import { createRawSnippet } from 'svelte';
import { formatDate } from '$lib/utils';

const listingTypes = {
  "volunteer": "Volunteer",
  "full-time":"Full Time",
  "part-time": "Part Time",
  "internship": "Internship"
};

export const getColumns = (loadListings: Function) => {
  return [
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
}