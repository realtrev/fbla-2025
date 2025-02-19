<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
  import Profile from '$lib/components/Profile.svelte';
  import { onMount } from 'svelte';
  import { PlusIcon } from 'lucide-svelte';

  import Loading from '$lib/components/Loading.svelte';

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
        <div class="w-full flex flex-col">
          {#each list.items as listing}
            <a class="w-full" href={`/admin/o/listings/${listing.id}`}>
              <p>{listing.title}</p>
            </a>
          {/each}
        </div>
    {:catch error}
      <div class="w-full h-96 flex items-center justify-center">
        Couldn't retreive job listings
      </div>
    {/await}
  </div>
</div>