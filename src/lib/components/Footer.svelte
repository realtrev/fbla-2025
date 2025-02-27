<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	
	import ArrowUpRightFromSquare from 'lucide-svelte/icons/arrow-up-right-from-square';
	import { buttonVariants } from "$lib/components/ui/button";

	let {
		hideLogo = false
	}: {
		hideLogo?: boolean
	} = $props();

	const footerLinks = [
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Licenses and Attributions',
			href: '/licenses'
		},
		{
			title: 'Terms of Service',
			href: '/terms'
		},
		{
			title: 'Privacy',
			href: '/privacy'
		},
		{
			title: 'Cookies',
			href: '/cookies'
		},
		{
			title: 'Feedback',
			href: '/feedback'
		},
		{
			title: 'Source Code',
			href: 'https://github.com/realtrev/fbla-2025',
			icon: ArrowUpRightFromSquare
		},
	];
</script>

<footer class="w-full relative bg-muted/50 px-6">
	<div class="max-w-screen-xl mx-auto py-5 h-full px-4 gap-4 flex flex-col items-center border-t border-border">
		{#if !hideLogo}
			<Logo variant="large" />
		{/if}
		<div class="flex gap-0.5 text-sm flex-wrap items-center justify-center">
			{#each footerLinks as link}
				{#if !link.href.startsWith("/")}
					<a
						href={link.href}
						target="_blank"
						rel="noopener"
						class={buttonVariants({ variant: "ghost"})}
					>
						{#if link.icon}
							<link.icon class="size-4" />
						{/if}
						<p>{link.title}</p>
					</a>
				{:else}
					<a
						href={link.href}
						class={buttonVariants({ variant: "ghost"})}
					>
						{#if link.icon}
							<link.icon class="size-4" />
						{/if}
						<p>{link.title}</p>
					</a>
				{/if}
			{/each}
		</div>
		<p class="text-muted-foreground text-sm md:w-auto w-full text-center">
			Made by Thomas Huang and Trevor Daly for FBLA Website Coding and Development 2025
		</p>
	</div>
</footer>