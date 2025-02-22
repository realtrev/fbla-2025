<script lang="ts">
    import type { Component } from 'svelte';
    import DynamicButton from '../../migration/DynamicButton.svelte';

    let {
        label = "",
        currentPage = $bindable("/"),
        link = $bindable(""),
        open = $bindable(false),

        icon = null,
        icononly = $bindable(false),
        ...props
    }: {
        label?: string;
        currentPage?: string;
        link?: string;

        icon?: Component<{class: string}> | null,
        icononly?: boolean,
        class?: string,

        onclick?: (e: Event) => void
    } = $props();

    const dispatch = {
        onclick: (event: Event) => {
            open = false;
            if (props.onclick) {
                event.preventDefault();
                props.onclick(event);
            }
        }
    }

    let selected = $derived(link !== "" && currentPage.startsWith(link));
</script>

<a href={link ?? ""} onclick={dispatch.onclick} class={`${props.class ?? ''} ${selected ? 'hover:bg-accent-8 text-white' : 'focus:bg-accent-7 hover:text-white text-accent-2 hover:bg-accent-8'} hover:bg-opacity-15 focus:bg-opacity-15 group ring-opacity-0 avoid-focus flex items-center overflow-hidden transition`}>
    <div class={`h-12 w-1 ${selected ? 'bg-accent-4' : ''} group-focus:bg-accent-6 rounded-r-full transition`}>
    </div>
    <div class="flex items-center gap-2.5 px-5">
        <svelte:component this={icon} class={`group-hover:text-accent-5 transition-all w-5 h-5 shrink-0 ${selected ? 'text-accent-5' : ''}`} />
        <p class="font-normal">{label}</p>
    </div>
</a>