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

</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will remove this listing from your school. The organization will have to request permission again.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
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