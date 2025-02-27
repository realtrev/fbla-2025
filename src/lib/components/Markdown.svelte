<script lang="ts">
	import { marked } from 'marked';
  import sanitizeHtml from 'sanitize-html';
	import { cn } from '$lib/utils';

	let {
		content = $bindable(""),
		class: className = '',
		parsed = false
	}: {
		content: string,
		class?: string
	} = $props();

	let htmlContent = $derived(sanitizeHtml(marked.parse(content)));
</script>

<div class={cn(className, "markdown-content flex flex-col items-center")}>
	{@html htmlContent}
</div>

<style>
	.markdown-content :global(h1) {
			@apply scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl max-w-screen-sm w-full;
	}

	.markdown-content :global(h2) {
			@apply mt-10 scroll-m-20 pb-2 text-2xl lg:text-3xl font-semibold tracking-tight transition-colors first:mt-0 w-full max-w-screen-sm;
	}

	.markdown-content :global(h3) {
			@apply mt-6 scroll-m-20 text-xl lg:text-2xl font-semibold tracking-tight max-w-screen-sm w-full;
	}

	.markdown-content :global(h4) {
			@apply scroll-m-20 lg:text-xl font-semibold tracking-tight max-w-screen-sm w-full;
	}

	.markdown-content :global(hr) {
		@apply max-w-screen-sm w-full border-b border-border mt-6;
	}

	:global( .markdown-content > p:not(:has(img))) {
			@apply leading-7 [&:not(:first-child)]:mt-3 max-w-screen-sm mt-1 w-full;
	}

	:global( blockquote > p:not(:has(img))) {
			@apply leading-7 [&:not(:first-child)]:mt-3 max-w-screen-sm mt-1 mx-6;
	}


	.markdown-content :global(blockquote) {
			@apply mt-6 border-l-2 italic text-foreground/75 mx-12 max-w-screen-sm w-full;
	}

	.markdown-content :global(ul) {
			@apply ml-6 list-disc mt-6 [&:not(:first-child)]:mt-3 max-w-screen-sm w-full;
	}

	.markdown-content :global(ol) {
			@apply mt-6 list-decimal pl-6 max-w-screen-sm w-full;
	}

	.markdown-content :global(li) {
			@apply leading-7 max-w-screen-sm w-full;
	}

	.markdown-content :global(a) {
			@apply text-blue-600 underline;
	}

	.markdown-content :global(img) {
		@apply rounded-md w-full shadow-lg mb-2;
	}
</style>