<script lang="ts">
	export let href: string | null = null;
	export let tabindex: number | null = null;
	export let selectNone: boolean = false;
	export let submit = false;
	export let reset = false;
	export let disabled = false;

	let className = '';
	export { className as class };
</script>

{#if submit}
	<button
		type="submit"
		on:click
		tabindex
		{disabled}
		class={`${selectNone ? 'hover:cursor-default ' : ''}${className} group`}
	>
		<slot />
	</button>
{:else if reset}
	<button
		type="reset"
		on:click
		tabindex
		{disabled}
		class={`${selectNone ? 'hover:cursor-default ' : ''}${className} group`}
	>
		<slot />
	</button>
{:else if href}
	<a {href} {disabled} {tabindex} on:click on:blur class={className + '  group'}>
		<slot />
	</a>
{:else}
	<button
		on:click
		tabindex
		{disabled}
		class={`${selectNone ? 'hover:cursor-default ' : ''}${className} group`}
	>
		<slot />
	</button>
{/if}

<style>
	.button {
		/*@apply disabled:brightness-90 active:brightness-[120%] whitespace-nowrap hover:scale-[1.05] focus:scale-[1.05] active:shadow-none active:scale-100 hover:shadow-xl hover:brightness-[105%] flex gap-2 items-center font-semibold transition-all ease-in-out duration-500 focus:outline-none rounded-xl cursor-pointer px-5 py-2.5 text-xs border-2 bg-primary-5 border-primary-5 text-white;*/
		@apply disabled:brightness-[.9] hover:brightness-110 active:brightness-95 flex gap-2.5 flex-nowrap whitespace-nowrap items-center font-medium border border-primary-5 text-surface-10 rounded-lg ring-0 transition-all hover:border-primary-5 focus:ring-2 focus:ring-primary-5 focus:ring-opacity-50 outline-none;
	}

	.button.sm {
		@apply px-3 py-1.5 text-xs hover:shadow-sm;
	}

	.button.md {
		@apply p-2.5 px-5 text-sm hover:shadow;
	}

	.button.lg {
		@apply px-8 py-3 text-base rounded-xl hover:shadow-lg;
	}

	.button.xl {
		@apply px-8 py-4 text-base hover:shadow-lg;
	}

	/* WHITE BUTTON */
	.button.white {
		@apply bg-white border-white text-surface-10 focus:ring-white/50;
	}

	/* PRIMARY BUTTON AND VARIATIONS */
	.button.primary {
		@apply bg-primary-5 border-primary-4/50 text-white;
	}

	.button.primary.glowing {
		@apply shadow-glow shadow-primary-8 hover:shadow-glow-lg hover:shadow-primary-8;
	}

	/* SECONDARY BUTTON AND VARIATIONS */
	.button.accent {
		@apply border-2 bg-accent-5 border-accent-5 text-accent-1 focus:ring-accent-5/50;
	}

	.button.accent.glowing {
		@apply shadow-glow shadow-accent-3 hover:shadow-glow-lg hover:shadow-accent-4;
	}

	/* SURFACE BUTTON AND VARIATIONS */
	.button.surface {
		@apply bg-surface-0 border-surface-1 text-surface-7 focus:ring-surface-2/50 hover:brightness-[1.02] active:brightness-95;
	}

	.button.surface.outlined {
		@apply border border-surface-3 text-surface-5 bg-opacity-0;
	}

	.button.surface.outlined.dark {
		@apply text-surface-0 border-surface-2;
	}

	.button.surface.glowing.dark {
		@apply shadow-glow shadow-surface-8 hover:shadow-glow-lg hover:shadow-surface-8;
	}

	/* OUTLINED BUTTON */
	.button.outlined {
		@apply bg-opacity-0;
	}
</style>
