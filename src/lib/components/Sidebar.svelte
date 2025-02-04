<script lang="ts">
    import Logo from '$lib/components/Logo.svelte';
    import SidebarItem from '$lib/components/SidebarItem.svelte';
    import { HomeIcon, MessageSquareIcon, CompassIcon } from 'lucide-svelte';
    import { page } from '$app/state';

    let icononly = $state(false);
</script>

<div class="block bg-black p-5 transition-all gap-y-1 flex flex-col" class:w-[93px]={icononly} class:w-[218px]={!icononly}>
    <Logo class="ring-opacity-0" onclick={() => icononly = !icononly} icon="light" text="light" icononly={icononly} />
    <SidebarItem link="/admin/o/dashboard" icon={HomeIcon} label="Dashboard" bind:currentPage={page.url.pathname} bind:icononly />
    <SidebarItem link="/admin/o/messages" icon={MessageSquareIcon} label="Messages" bind:currentPage={page.url.pathname} bind:icononly />
    <SidebarItem link="/admin/o/discover" icon={CompassIcon} label="Discover" bind:currentPage={page.url.pathname} bind:icononly />
</div>