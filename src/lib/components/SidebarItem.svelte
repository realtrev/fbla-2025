<script lang="ts">
    import type { Component } from 'svelte';
    import DynamicButton from '$lib/components/DynamicButton.svelte';

    let {
        label = "",
        currentPage = $bindable("/"),
        link = $bindable("/"),

        icon = null,
        icononly = $bindable(true)
    }: {
        label?: string;
        currentPage?: string;
        page?: string;

        icon?: Component<{class: string}> | null,
        icononly?: boolean
    } = $props();

    let selected = $derived(link === currentPage);
</script>

<DynamicButton href={link} class={`${selected ? 'bg-opacity-25 bg-surface-5' : 'bg-opacity-0'} focus:ring-accent-5 flex gap-2.5 px-3.5 py-3 rounded-lg font-normal hover:bg-accent-5 hover:bg-opacity-25 text-white overflow-hidden transition`}`>
    {#if icon}
        <svelte:component this={icon} class="transition-all w-6 h-6 shrink-0" />
    {/if}
    {#if !icononly}
        {label}
    {/if}
</DynamicButton>