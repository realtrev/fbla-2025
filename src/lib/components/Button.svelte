<script lang="ts">
	import {type ComponentType, createEventDispatcher} from 'svelte';
	import { ArrowRight, type Icon } from 'lucide-svelte';
	import DynamicButton from '$lib/components/DynamicButton.svelte';
	import {goto} from "$app/navigation";

	const dispatch = createEventDispatcher();

	export let label = 'Hello World';
	export let link = '';
	export let color: 'primary' | 'secondary' | 'accent' | 'white' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
	export let outlined = false;
	export let notab = false;
	export let redirectOptions: { [key: string]: string } = {};
	export let leftIcon: ComponentType<Icon> | null = null;
	export let rightIcon: ComponentType<Icon> | null = null;
	export let submit = false;
	export let reset = false;
	export let disabled = false;

	let className: string;

	function onClick(e: MouseEvent) {
		e.preventDefault();
		if (link) {
			goto(link, redirectOptions);
		}

		dispatch('click', {event: e});
	}

	export { className as class };
</script>

<DynamicButton {disabled} {submit} {reset} href={link} on:click={onClick} tabindex={notab ? '-1' : undefined} class={`button ${color} ${size} ${className} ${outlined ? 'outlined' : ''}`}>
	{#if leftIcon}
		<svelte:component this={leftIcon} class="w-5 h-5 stroke-2" />
	{/if}
	<p class="grow text-center">{label}</p>
	{#if rightIcon}
		<svelte:component this={rightIcon} class="w-5 h-5 stroke-2" />
	{/if}
</DynamicButton>