<script>
	import Logo from '$lib/components/Logo.svelte';
	
	import ArrowUpRightFromSquare from 'lucide-svelte/icons/arrow-up-right-from-square';
	import GitHub from 'lucide-svelte/icons/github';

	const footerLinks = [
		{
			title: 'GitHub',
			href: 'https://github.com/realtrev/fbla-2025',
			icon: GithubIcon
		},
		{
			title: 'Trevor\'s Portfolio',
			href: 'https://trevordaly.net/',
			icon: ArrowUpRightFromSquare
		}
	];
</script>

<footer class="w-screen bg-foreground relative">
	<svg
		class="w-screen absolute -translate-y-[100%] fill-foreground"
		viewBox="0 0 1728 91"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			opacity="0.25"
			d="M0 91V55.8968C68.8176 39.0617 149.17 31.5012 227.52 34.6634C328.838 38.7357 423.835 59.9235 525.312 63.1009C631.642 66.4072 737.77 50.3002 839.52 36.3621C939.269 22.7121 1038.67 17.4948 1141.06 26.4431C1193.11 30.9931 1241.64 39.9717 1291.46 48.6926C1424.87 72.0417 1602.72 101.837 1728 51.2103V91H0Z"
			fill="currentColor"
		/>
		<path
			opacity="0.5"
			d="M0 91V79.0107C18.72 63.0023 39.8016 47.8812 68.6736 36.3621C143.15 6.62025 237.6 6.825 323.395 21.5518C368.251 29.2489 409.925 41.3216 452.52 51.7335C511.445 66.1418 574.531 86.6168 640.915 89.3999C693.13 91.5612 743.011 82.2564 782.899 65.4669C828.648 46.2128 872.64 18.4502 932.126 10.1086C990.36 1.92617 1049.27 15.1818 1103.67 28.5209C1158.08 41.86 1211.9 58.0959 1272.04 61.1672C1358.05 65.6034 1435.16 43.8165 1515.25 31.7135C1558.74 25.1463 1600.21 27.0346 1640.66 37.401C1672.96 45.6593 1709.78 57.8229 1728 74.7413V91H0Z"
			fill="currentColor"
		/>
		<path
			d="M0 91V86.7306C215.899 46.2583 452.29 36.9157 685.195 58.7178C747.115 64.5114 806.486 73.9754 868.954 78.7832C953.914 85.3277 1030.92 69.5013 1107.36 51.9383C1192.22 32.4415 1275.84 18.7763 1369.73 22.75C1494.33 28.0583 1618.07 57.4134 1728 87.0642V91H0Z"
			fill="currentColor"
		/>
	</svg>
	<div class="max-w-screen-xl mx-auto py-5 h-full px-4">
		<div class="flex flex-wrap">
			<Logo iconColor="text-background" textColor="text-background" />
			<div class="ml-auto flex gap-0.5">
				{#each footerLinks as link}
					<a
						href={link.href}
						target="_blank"
						rel="noopener"
						class="text-background whitespace-nowrap hover:bg-muted/10 rounded-md flex px-4 h-10 items-center justify-center transition-all"
					>
						<svelte:component this={link.icon} class="w-6 h-6 mr-2" />
						<p class="text-background">{link.title}</p>
					</a>
				{/each}
				<a
					href="/licenses"
					class="text-background whitespace-nowrap hover:bg-muted/10 rounded-md flex px-4 h-10 items-center justify-center transition-all"
				>
					Licenses and Attributions
				</a>
			</div>
		</div>
		<div class="ml-auto flex gap-2 justify-center w-full">
			<p class="text-background/75 text-sm mt-4 md:w-auto w-full text-center">
				Made by Thomas Huang and Trevor Daly for FBLA Website Coding and Development 2025
			</p>
		</div>
	</div>
</footer>
