<script lang="ts">
    import type { Snippet } from 'svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { children }: {
        children: Snippet
    } = $props();
</script>

<div class="flex min-h-screen">
    <Sidebar />
    {@render children()}
</div>
