<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { cn } from '$lib/utils';

	let {
		content,
		class: className = ''
	}: {
		content: string,
		class?: string
	} = $props();

	let htmlContent = $derived(DOMPurify.sanitize(marked.parse(content)));
</script>

<div class={cn(className, "markdown-content")}>
	{@html htmlContent}
</div>

<style>
	.markdown-content :global(h1) {
			@apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
	}

	.markdown-content :global(h2) {
			@apply mt-10 scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight transition-colors first:mt-0;
	}

	.markdown-content :global(h3) {
			@apply scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight;
	}

	.markdown-content :global(h4) {
			@apply scroll-m-20 lg:text-xl font-semibold tracking-tight;
	}

	.markdown-content :global(p) {
			@apply leading-7 [&:not(:first-child)]:mt-6;
	}

	.markdown-content :global(blockquote) {
			@apply mt-6 border-l-2 pl-6 italic text-foreground/75;
	}

	.markdown-content :global(ul) {
			@apply my-6 ml-6 list-disc [&\>li]:mt-2;
	}

	.markdown-content :global(ol) {
			@apply mt-6 list-decimal pl-6;
	}

	.markdown-content :global(li) {
			@apply leading-7;
	}

	.markdown-content :global(a) {
			@apply text-blue-600 underline;
	}
</style>