<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { buttonVariants } from "$lib/components/ui/button";
  import { pb } from '$lib/pocketbase';
  import { toast } from 'svelte-sonner';
  import type { ListingModel } from '../../../../app';
  import { goto } from '$app/navigation';

  let {
    listing,
    updateTable
  }: {
    listing: ListingModel,
    updateTable: () => void
  } = $props();

  let open = $state(false);

  async function deleteListing() {
    open = false;
    await pb.collection('listings').delete(listing.id)
      .then(() => {
        toast.success('Deleted ' + listing.title);
        updateTable();
      });
  }

  async function archiveListing() {
    open = false;
    await pb.collection('listings').update(listing.id, {
      archived: true
    })
    .then(() => {
      toast.success('Archived ' + listing.title);
      updateTable();
    })
  }
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently {listing.published ? "archive" : "delete"} this listing.
        {listing.published ? "Archived listings cannot be viewed publicly or published again."
          : ""}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      {#if listing.published}
        <AlertDialog.Action onclick={archiveListing}>Archive</AlertDialog.Action>
      {:else}
        <AlertDialog.Action onclick={deleteListing}>Delete</AlertDialog.Action>
      {/if}
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<DropdownMenu.Root>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
      <DropdownMenu.Item onclick={() => { navigator.clipboard.writeText(listing.id); toast.success('Copied listing ID.'); }}>
        Copy listing ID
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={() => goto(`/admin/o/listings/${listing.id}`)}>
        Manage listing
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    {#if !listing.archived}
      <DropdownMenu.Separator />
      <DropdownMenu.Item class="font-semibold" onclick={() => open = true}>{listing.published ? "Archive" : "Delete"} listing</DropdownMenu.Item>
    {/if}
  </DropdownMenu.Content>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
</DropdownMenu.Root>