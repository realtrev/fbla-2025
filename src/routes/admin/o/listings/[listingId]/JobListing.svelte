<script lang="ts">
	import type { ListingModel, OrganizationModel } from '../../../../../app';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import { Badge } from '$lib/components/ui/badge';
	import Markdown from '$lib/components/Markdown.svelte';
	import { Button } from '$lib/components/ui/button';

	let {
		listing,
		organization,
	}: {
		listing: ListingModel;
		organization: OrganizationModel;
	} = $props();

	const values = {
		"volunteer": "Volunteer",
		"full-time":"Full Time",
		"part-time": "Part Time",
		"internship": "Internship"
	};
</script>

<div class="mt-6">
	<h1 class="text-4xl md:text-5xl font-bold">
		{listing.title}
	</h1>
	<div class="mt-4 flex gap-6 items-center flex-wrap">
		<a href={`/organizations/${organization.id}`} class="text-muted-foreground hover:underline">
			{organization.name}
		</a>

		{#if listing.location}
			<p class="text-muted-foreground flex items-center">
				<MapPin class="size-5 inline-block mr-1" />
				{listing.location}
			</p>
		{/if}
		<Badge>{values[listing.type]}</Badge>
	</div>
	<div class="my-6">
		{#if listing.thumbnail}
			<img src={listing.thumbnail} class="rounded-md shadow mb-6" />
		{/if}
		<Markdown	content={listing.description} />
	</div>
	<div class="w-full flex my-12 items-center justify-center">
		<Button class="shadow-lg shadow-primary/40">
			Apply for this job
		</Button>
	</div>
</div>
