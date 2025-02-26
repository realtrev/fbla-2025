<script lang="ts">
	import type { ListingModel, OrganizationModel } from '../../../../../app';
	import { MapPin } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import Markdown from '$lib/components/Markdown.svelte';

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

	let htmlContent = $derived(marked.parse(listing.description));
</script>

<div class="mt-6">
	<h1 class="text-xl md:text-3xl font-bold">
		{listing.title}
	</h1>
	<div class="mt-2 flex gap-6 items-center border-b pb-6">
		<a href={`/organizations/${organization.id}`} class="text-muted-foreground font-semibold underline">
			{organization.name}
		</a>

		{#if listing.location}
			<p class="text-muted-foreground flex items-center">
				<MapPin class="size-5 inline-block mr-1" />
				{listing.location}
			</p>
		{/if}
		<Badge variant="outline">{values[listing.type]}</Badge>
	</div>
	<div class="mt-6">
		<Markdown	content={listing.description} />
	</div>
</div>
