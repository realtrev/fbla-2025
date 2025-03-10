<script lang="ts">
	import Saos from 'saos';
	import CircleDollarSignIcon from 'lucide-svelte/icons/circle-dollar-sign';
	import Clock1Icon from 'lucide-svelte/icons/clock-1';
	import GraduationCapIcon from 'lucide-svelte/icons/graduation-cap';
	import HandHeartIcon from 'lucide-svelte/icons/hand-heart';
	import HandshakeIcon from 'lucide-svelte/icons/handshake';
	import ScaleIcon from 'lucide-svelte/icons/scale';
	import type { ComponentType } from 'svelte';
	import Search from 'lucide-svelte/icons/search';
	import UserCheck from 'lucide-svelte/icons/user-check';

	let {
		theme = 'primary',
		class: className,
	} : {
		theme?: 'primary' | 'accent'
	} = $props();

	const benefits: {
		title: string;
		description: string;
		icon: ComponentType<Icon>;
	}[] = [
		{
			title: 'Find Jobs Easily',
			description:
				'Students can quickly browse and apply for local, school-approved jobs.',
			icon: Search
		},
		{
			title: 'School Connections',
			description:
				'Schools help connect students with trusted businesses for safe and reliable opportunities.',
			icon: ScaleIcon
		},
		{
			title: 'Hire Students Fast',
			description:
				'Businesses can easily find motivated student workers ready to learn and grow.',
			icon: UserCheck
		},
		{
			title: 'Easy to Use',
			description:
				'A simple, user-friendly platform for both job searching and hiring.',
			icon: CircleDollarSignIcon
		},
		{
			title: 'Gain Experience',
			description:
				'Students build real-world skills and work experience for the future.',
			icon: HandshakeIcon
		},
		{
			title: 'Stronger Community',
			description:
				'Schools, businesses, and students work together to create more opportunities and local growth.',
			icon: HandHeartIcon
		}
	];
</script>

<section
	class={`theme-${theme} overflow-hidden relative bg-color justify-center gap-24 -z-20 ${className}`}
>
	<div class="absolute blurbox bg-color-splotch left -z-10"></div>
	<div class="absolute blurbox bg-color-splotch right -z-10"></div>
	<div class="max-w-screen-xl px-8 py-32 mx-auto z-10">
		<Saos once={true} animation={'slide-up 1s cubic-bezier(0.55, 0, 0.1, 1) both'}>
			<h1 class="text-2xl md:text-4xl font-bold w-full text-center text-surface-10">
				Why work for Productify?
			</h1>
		</Saos>
		<div
			class="mx-auto grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-2 gap-8 mt-16 fade-out-bottom"
		>
			{#each benefits as benefit, i}
				<Saos
					once={true}
					animation={`slide-up-big 1s cubic-bezier(0.55, 0, 0.1, 1) both ${i * 0.1}s`}
				>
					<div class="col-span-1 text-color-icon">
						<svelte:component this={benefit.icon} class="w-16 h-16 stroke-[1.5]" />
						<h3 class="text-lg text-foreground font-bold my-2">
							{benefit.title}
						</h3>
						<p class="text-muted-foreground line-clamp-6">
							{benefit.description}
						</p>
					</div>
				</Saos>
			{/each}
		</div>
	</div>
</section>

<style>
	.theme-primary.bg-color {
		@apply bg-primary/5;
	}

	.theme-primary .bg-color-splotch {
		@apply bg-primary/5;
	}

	.theme-primary .text-color-h {
		@apply text-foreground;
	}

	.theme-primary .text-color-p {
		@apply text-foreground/50;
	}

	.theme-primary .text-color-icon {
		@apply text-primary;
	}
</style>
