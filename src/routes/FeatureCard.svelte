<script lang="ts">
	let {
		title,
		description,
		icon = null,
	} : {
		title: string,
		description: string,
		icon?: Component<{class: string}> | null
	} = $props();
</script>

<div
	class="p-12 max-h-full flex flex-col items-center col-span-1 bg-background/20 rounded-xl shadow-xl shadow-accent-2"
>
	<svelte:component this={icon} class="w-20 h-20 text-background" strokeWidth="1.5" />
	<h1 class="text-lg font-semibold mt-5 text-center w-full text-background">{title}</h1>
	<p class=" mt-5 text-center w-full text-background">{description}</p>
</div>
