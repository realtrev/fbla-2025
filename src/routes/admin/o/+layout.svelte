<script lang="ts">
    import type { Snippet } from 'svelte';
    import Sidebar from '$lib/components/OrgSidebar.svelte';
    import { currentOrganization } from '$lib/pocketbase';
    import Button from '$lib/components/Button.svelte';
    import { PlusIcon, SearchIcon, MenuIcon } from 'lucide-svelte';
    import TextInput from '$lib/components/TextInput.svelte';

    let { children }: {
        children: Snippet
    } = $props();

    let sidebarOpen = $state(false);
</script>

<div class="flex min-h-screen">
    <Sidebar bind:open={sidebarOpen} />
    <div class="flex flex-col grow">
        <div class="h-20 w-full flex items-center px-5 border-b border-surface-1 justify-between">
            <div class="flex gap-5">
                <button class="lg:hidden block" onclick={() => sidebarOpen = !sidebarOpen}>
                    <MenuIcon class="w-5 h-5" />
                </button>
                <div>
                    <h1 class="font-medium text-surface-9">{$currentOrganization.name} <span class="text-surface-4">/</span> Dashboard</h1>
                </div>
            </div>
            <div class="flex gap-5">
                <TextInput
                    placeholder="Search"
                >
                    {#snippet before()}
                        <SearchIcon class="text-surface-4 w-5 h-5 pr-1 shrink-0" />
                    {/snippet}
                </TextInput>
                <!--<Button-->
                <!--    label="Create"-->
                <!--    color="accent"-->
                <!--    class="glowing"-->
                <!--    leftIcon={PlusIcon}-->
                <!--    link="/admin/o/listings/create"-->
                <!--/>-->
            </div>
        </div>
        {@render children()}
    </div>
</div>
