<script lang="ts">
	import Saos from 'saos';
	import CircleDollarSignIcon from 'lucide-svelte/icons/circle-dollar-sign';
	import Clock1Icon from 'lucide-svelte/icons/clock-1';
	import GraduationCapIcon from 'lucide-svelte/icons/graduation-cap';
	import HandHeartIcon from 'lucide-svelte/icons/hand-heart';
	import HandshakeIcon from 'lucide-svelte/icons/handshake';
	import ScaleIcon from 'lucide-svelte/icons/scale';
	import PalmtreeIcon from 'lucide-svelte/icons/palmtree';
	import Laptop from 'lucide-svelte/icons/laptop';
	import type { ComponentType } from 'svelte';

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
			title: 'Flexible Work Schedule',
			description:
				'At Productify. we champion flexibility. Your schedule, your way. Strike the perfect balance between work and life. Join us and embrace a culture that values your time.',
			icon: Clock1Icon
		},
		{
			title: 'Equity Potential',
			description:
				'Exceptional contributions, tangible rewards. Earn equity at Productify—a unique opportunity for select team members. Join us, excel, and shape our success story together.',
			icon: ScaleIcon
		},
		{
			title: 'Growth Opportunities',
			description:
				'At Productify, we invest in your potential. Access workshops, training, and development programs to enhance your skills. Join us, embrace continuous learning, and propel your career forward.',
			icon: GraduationCapIcon
		},
		{
			title: 'Paid Leave',
			description:
				'We offer generous PTO for rest and personal matters, and paid VTO for volunteer efforts. We value your well-being and satisfaction, and believe in giving back to the community.',
			icon: CircleDollarSignIcon
		},
		{
			title: 'Collaborative Atmosphere',
			description:
				'Our culture values open communication and teamwork. Experience a positive and inclusive environment where your ideas thrive.',
			icon: HandshakeIcon
		},
		{
			title: 'Health and Wellness',
			description:
				'Enjoy health coverage, mental health resources, and more. Join us for a holistic approach to your professional and personal vitality. Your success begins with a healthy foundation.\n',
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
			<h1 class="heading-2xl bold text-color-h w-1/2 text-center mx-auto">
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
						<h3 class="heading-md font-bold my-2 text-color-h">
							{benefit.title}
						</h3>
						<p class="text-color-p line-clamp-6">
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
