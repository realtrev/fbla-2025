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
	class="p-12 max-h-full flex flex-col items-center col-span-1 bg-accent-1 border border-accent-4 rounded-xl shadow-xl shadow-accent-2"
>
	<svelte:component this={icon} class="w-20 h-20 text-accent-7" strokeWidth="1.5" />
	<h1 class="heading-lg bold mt-5 text-center w-full text-accent-10">{title}</h1>
	<p class=" mt-5 text-center w-full text-accent-8">{description}</p>
</div>
