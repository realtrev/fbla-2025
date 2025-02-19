<script lang="ts">
    import Logo from '$lib/components/Logo.svelte';
    import SidebarItem from '$lib/components/SidebarItem.svelte';
    import {
        HomeIcon,
        MessageSquareIcon,
        SchoolIcon,
        PlusCircleIcon,
        ListCheckIcon,
        SettingsIcon,
        UserIcon, LogOutIcon
    } from 'lucide-svelte';
    import { currentOrganization } from '$lib/pocketbase';
    import { page } from '$app/state';
    import { currentUser } from '$lib/pocketbase';
    import Profile from '$lib/components/Profile.svelte';
    import { onMount } from 'svelte';

    let {
        open = $bindable(false)
    }: {
        open?: boolean
    } = $props();

    let icononly = $state(false);

    onMount(() => {
        window.onresize = () => {
            open = false;
        }
    });
</script>

<div onclick={() => open = false} class={`absolute w-screen h-screen ${open ? '' : 'hidden'}`}>

</div>

<div class={`z-30 shrink-0 bg-accent-10 transition-transform flex flex-col w-64 h-screen overflow-y-scroll absolute lg:relative ${open ? 'translate-x-[0%]' : 'lg:translate-x-0 translate-x-[-100%]'}`}>
    <div class="flex items-center py-5 px-5">
        <Logo class="ring-opacity-0" onclick={() => icononly = !icononly} icon="light" text="dark" icononly={true} />
        <p class="text-white text-2xl overflow-ellipsis line-clamp-1">JobFair</p>
    </div>
    <!--<div class="w-full px-5 pb-5">-->
    <!--    <a href="/admin/o/settings" class="group py-3 rounded-lg px-3 w-full bg-white bg-opacity-10 text-white text-lg flex justify-between items-center">-->
    <!--        {$currentOrganization?.name}-->
    <!--        <SettingsIcon class="w-5 h-5 transition group-hover:rotate-[30deg]" />-->
    <!--    </a>-->
    <!--</div>-->
    <div class="flex flex-col gap-y-2 grow pb-10">
        <SidebarItem link="/admin/o/dashboard" icon={HomeIcon} label="Dashboard" bind:currentPage={page.url.pathname} bind:open />
        <SidebarItem link="/admin/o/listings" icon={ListCheckIcon} label="My Listings" bind:currentPage={page.url.pathname} bind:open />
        <SidebarItem link="/admin/o/applications" icon={PlusCircleIcon} label="Applications" bind:currentPage={page.url.pathname} bind:open />
        <SidebarItem link="/admin/o/messages" icon={MessageSquareIcon} label="Messages" bind:currentPage={page.url.pathname} bind:open />
        <SidebarItem link="/admin/o/partners" icon={SchoolIcon} label="Partnerships" bind:currentPage={page.url.pathname} bind:open />
    </div>
    <SidebarItem link="/account" icon={UserIcon} label="Account" bind:currentPage={page.url.pathname} />
    <SidebarItem onclick={() => window.location.href = "/api/logout"} icon={LogOutIcon} class="mb-5 mt-2" label="Log Out" />
    <!--<div class="flex gap-2.5 shrink-0 py-5 mx-5 border-t border-opacity-20 border-white">-->
    <!--    <Profile size="w-10" />-->
    <!--    <div>-->
    <!--        <p class="text-white font-normal">{`${$currentUser?.firstName} ${$currentUser?.lastName}`}</p>-->
    <!--        <p class="text-white opacity-40 text-sm font-normal">{`${$currentUser?.email}`}</p>-->
    <!--    </div>-->
    <!--    <Button-->
    <!--        label="Log out"-->
    <!--        color="white"-->
    <!--        class="w-full"-->
    <!--        size="md"-->
    <!--        onclick={() => goto("/api/logout")}-->
    <!--      />-->
    <!--</div>-->
</div>