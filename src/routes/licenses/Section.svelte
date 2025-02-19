<script lang="ts">
	export let title;
	export let content;

	let paragraphs = content?.split('\n') ?? ['No content'];
</script>

<h1 class="text-xl font-semibold text-surface-9 mt-8">{title}</h1>
{#each paragraphs as paragraph, i}
	<p class="text-surface-7 mt-4 mb-8">{paragraph}</p>
{/each}
