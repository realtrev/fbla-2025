<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
  import Profile from '$lib/components/Profile.svelte';
  import { onMount } from 'svelte';
  import { PlusIcon } from 'lucide-svelte';

  import Loading from '$lib/components/Loading.svelte';
  import Listing from './Listing.svelte';

  let {
    data
  }: {
    data: {
      listings: ListingModel[]
    }
  } = $props();

  let list = $state([] as ListingModel[]);

  onMount(async () => {
    list = await data.listings;
    console.log(list);
  })
</script>

<div class="p-5">
  <div class="w-full flex justify-between items-center">
    <h1 class="heading-lg">Listings</h1>
    <Button
          label="Create"
          color="accent"
          leftIcon={PlusIcon}
          link="/admin/o/listings/create"
      />
  </div>
  <div>
    {#await data.listings}
      <div class="w-full h-96 flex items-center justify-center">
        <Loading />
      </div>
    {:then}
        <div class="w-full flex flex-col mt-5 border border-surface-1 rounded-xl py-5">
          <div class="grid grid-cols-10 px-3 text-sm font-surface-7">
            <div class="col-span-2">
              <p>Title</p>
            </div>
          </div>
          {#each list.items as listing}
          <Listing listing={listing} />
          {/each}
            <div class="w-full border-t border-t-surface-2"></div>
        </div>
    {:catch error}
      <div class="w-full h-96 flex items-center justify-center">
        Couldn't retreive job listings
      </div>
    {/await}
  </div>
</div>