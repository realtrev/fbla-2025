<script lang="ts">
    import Logo from '$lib/components/Logo.svelte';
    import SidebarItem from '$lib/components/SidebarItem.svelte';
    import { HomeIcon, MessageSquareIcon, CompassIcon, PlusIcon, PlusCircleIcon, ListCheckIcon } from 'lucide-svelte';
    import Button from '$lib/components/Button.svelte';
    import { page } from '$app/state';
    import { currentOrganization } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    let icononly = $state(false);
</script>

<div class="block px-5 bg-surface-0 transition-all flex flex-col w-64">
    <div class="flex items-center py-5">
        <Logo class="ring-opacity-0" onclick={() => icononly = !icononly} icon="dark" text="dark" icononly={true} />
        <p class="text-surface-9 text-2xl overflow-ellipsis line-clamp-1">{$currentOrganization.name}</p>
    </div>
    <Button
        label="Create Listing"
        leftIcon={PlusIcon}
        color="primary"
        class="w-full mb-5"
        size="lg"
        link="/admin/o/listings/create"
      />
    <div class="flex flex-col gap-y-1 grow pb-10">
        <SidebarItem link="/admin/o/dashboard" icon={HomeIcon} label="Dashboard" bind:currentPage={page.url.pathname} />
        <SidebarItem link="/admin/o/listings" icon={ListCheckIcon} label="My Listings" bind:currentPage={page.url.pathname} />
        <SidebarItem link="/admin/o/applications" icon={PlusCircleIcon} label="Applications" bind:currentPage={page.url.pathname} />
        <SidebarItem link="/admin/o/messages" icon={MessageSquareIcon} label="Messages" bind:currentPage={page.url.pathname} />
    </div>
    <div class="flex flex-col gap-y-1 shrink-0 pb-5">
        <Button
            label="Log out"
            color="white"
            class="w-full"
            size="md"
            onclick={() => goto("/api/logout")}
          />
    </div>
</div>