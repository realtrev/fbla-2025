<script lang="ts">
    import type { Component } from 'svelte';
    import DynamicButton from '$lib/components/DynamicButton.svelte';

    let {
        label = "",
        currentPage = $bindable("/"),
        link = $bindable("/"),

        icon = null,
        icononly = $bindable(false)
    }: {
        label?: string;
        currentPage?: string;
        link?: string;

        icon?: Component<{class: string}> | null,
        icononly?: boolean
    } = $props();

    let selected = $derived(link === currentPage);
</script>

<DynamicButton href={link} class={`${selected ? 'bg-white shadow-lg focus:bg-opacity-50' : 'focus:bg-opacity-25 hover:bg-surface-3 hover:bg-opacity-15 bg-opacity-0'} ring-opacity-0 avoid-focus flex items-center gap-2.5 px-3.5 py-3 rounded-lg font-normal text-surface-8 overflow-hidden transition`}>
    {#if icon}
        <svelte:component this={icon} class="transition-all w-5 h-5 shrink-0" />
    {/if}
    {#if !icononly}
        {label}
    {/if}
</DynamicButton>