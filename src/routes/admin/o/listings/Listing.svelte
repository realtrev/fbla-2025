<script lang="ts">
  import { EllipsisVerticalIcon } from 'lucide-svelte';
  import { createMenu } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

  let {
    listing
  } : {
    listing: ListingModel
  } = $props();

	const menu = createMenu({ label: 'Actions' })
</script>

<a class="w-full font-normal text-surface-10 grid grid-cols-10 items-center px-3 py-4 border-t border-t-surface-2" href={`/admin/o/listings/${listing.id}`}>
  <p class="col-span-2">{listing.title}</p>
  <p class={`col-span-7 ${listing.description.length ? '' : 'text-surface-5'}`}>{listing.description.length ? listing.description : "No description."}</p>
  <div onclick={(e) => e.preventDefault()} class="col-span-1 flex items-center justify-end">
    <button use:menu.button class="group p-2 avoid-focus focus:bg-surface-1 rounded-full hover:bg-surface-1">
      <EllipsisVerticalIcon class="w-5 h-5" />
    </button>
  <Transition
			show={$menu.expanded}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
      <div
				use:menu.items
        class="origin-top-right translate-y-[100%] divide-y flex flex-col gap-1 p-2 absolute bg-white rounded-lg border border-surface-1">
        <button use:menu.item>Delete</button>
        <button use:menu.item>Delete</button>
      </div>
  </Transition>
  </div>

</a>