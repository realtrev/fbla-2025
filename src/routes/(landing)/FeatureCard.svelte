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
	class="p-6 py-12 h-full md:h-[340px] flex flex-col items-center col-span-1 bg-background/75 border border-border rounded-xl shadow shadow-accent-2"
>
	<svelte:component this={icon} class="w-20 h-20 text-primary" strokeWidth="1.5" />
	<h1 class="text-xl font-semibold mt-6 text-center w-full text-foreground">{title}</h1>
	<p class=" mt-3 text-center w-full text-muted-foreground">{description}</p>
</div>
