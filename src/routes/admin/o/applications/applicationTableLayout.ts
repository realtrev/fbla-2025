export const getColumns = () => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      accessorFn: (row) => `${row.expand.student.firstName} ${row.expand.student.lastName}`
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return renderComponent(ListingTypes, { listingType: row.getValue('status') });
      }
    },
    {
      accessorKey: "listing",
      header: "Listing",
      accessorFn: (row) =>  row.expand.listing.title
    },
    {
      accessorKey: "submitted",
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
}