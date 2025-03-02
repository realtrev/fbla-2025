<script lang="ts">
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { buttonVariants } from "$lib/components/ui/button";
  import { pb } from '$lib/pocketbase';
  import { toast } from 'svelte-sonner';
  import type { ListingModel, SchoolModel } from '../../../../../app';
  import { goto } from '$app/navigation';
  import MailPlus from 'lucide-svelte/icons/mail-plus';
  import MailMinus from 'lucide-svelte/icons/mail-minus';
  import Trash2 from 'lucide-svelte/icons/trash-2';
  import Loading from '$lib/components/Loading.svelte';
  import { postAction } from '$lib/utils';

  let {
    school,
    listing,
    updateTable
  }: {
    school: SchoolModel,
    listing: ListingModel,
    updateTable: () => void
  } = $props();

  let open = $state(false);

  // unrequested
  let confirmed = $state([]);
  let requested = $state([]);

  let runningAction = $state(false);
  let removeAlertOpen = $state(false);

  if (listing.requestedSchools !== undefined && listing.confirmedSchools !== undefined) {
    confirmed = listing.confirmedSchools.includes(school.id);
    requested = listing.requestedSchools.includes(school.id);
  }

  $effect(() => {
    if (listing.requestedSchools !== undefined && listing.confirmedSchools !== undefined) {
      confirmed = listing.confirmedSchools.includes(school.id);
      requested = listing.requestedSchools.includes(school.id);
    }
  })

  const requestSchool = postAction("??/requestSchool", {
    onSubmit: ({ formData }) => {
      console.log("trying");
      formData.append("school", school.id);
      runningAction = true;
    },
    onResult: ({ action }) => {
      listing.requestedSchools = action.data.requestedSchools;
      console.log(action);
      runningAction = false;
    }
  });

  const cancelRequest = postAction("??/requestSchool", {
    onSubmit: ({ formData }) => {
      console.log("trying");
      formData.append("school", school.id);
      formData.append("cancelRequest", true);
      runningAction = true;
      removeAlertOpen = false;
    },
    onResult: ({ action }) => {
      console.log(action);
      listing.requestedSchools = action.data.requestedSchools;
      listing.confirmedSchools = action.data.confirmedSchools;

      runningAction = false;
    }
  });
</script>

<AlertDialog.Root bind:open={removeAlertOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Remove from {school.name}?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will remove this listing from the selected school. You will have to reapply if you want the listing shown again.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={cancelRequest.submit}>Yes, remove it</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<div class="w-full flex justify-end">
  {#if confirmed}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button disabled={runningAction} variant="ghost" onclick={() => removeAlertOpen = true}>
          {#if runningAction}
            <Loading />
          {:else}
            <Trash2 class="size-4 text-primary" />
          {/if}
          Remove
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Remove listing from this school</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
  {:else if requested}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button disabled={runningAction} variant="outline" onclick={cancelRequest.submit}>
          {#if runningAction}
            <Loading />
          {:else}
            <MailMinus class="size-4 text-primary" />
          {/if}
          Cancel
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Cancel request for this listing to be shown</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>

  {:else}
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button disabled={runningAction} variant="outline" onclick={requestSchool.submit}>
          {#if runningAction}
            <Loading />
          {:else}
            <MailPlus class="size-4 text-primary" />
          {/if}
          Request
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Request for this listing to be shown</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>

  {/if}
</div>