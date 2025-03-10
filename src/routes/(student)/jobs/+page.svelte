<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import type { ListingModel } from '../../../app';
	import * as Card from "$lib/components/ui/card";
	import { Button } from '$lib/components/ui/button';
	import BookmarkIcon from 'lucide-svelte/icons/bookmark';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { buildDebouncer } from '$lib/utils';

	let jobs = $state([]) as ListingModel[];

	onMount(async () => {
		const response = await pb.collection('listings').getFullList({
			expand: "organization"
		}) as ListingModel[];
		if (response && response.length) {
			jobs = response;
		}
	});

	const prettyType = {
		'full-time': 'Full Time',
		'part-time': 'Part Time',
		'internship': 'Internship',
		'volunteer': 'Volunteer',
	}

	let debouncer = buildDebouncer((search) => {
		console.log(search);
	}, 500);

	function oninput(e: Event) {
		debouncer(e.target.value);
	}
</script>

<h1 class="text-2xl font-semibold">Recommended jobs</h1>

<Input placeholder="Search jobs" class="w-full max-w-[32rem] mt-6"oninput={oninput} />

<div class="w-full grid gap-6 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-screen-xl mt-6">
	{#each jobs as job}
		<Card.Root>
			<div class="flex flex-row justify-between items-center m-6 mb-0">
				<div class="flex flex-row gap-4">
					<Badge>{prettyType[job.type]}</Badge>
					<Card.Description>
						{job.location}
						{#if job.location}
						<span class="mx-1">
							•
						</span>
						{/if}
						{job.expand.organization.name}
					</Card.Description>
				</div>
			</div>
			<div>
				<p class="text-2xl font-semibold z-10 block mx-6 mt-1 line-clamp-1">{job.title}</p>
			</div>
			<Card.Content>
				<div class="w-full aspect-[4/3] rounded-lg p-6 relative bg-gradient-to-tl from-blue-900 to-teal-500">
					{#if job.thumbnail}
						<img src={job.thumbnail} alt={job.title} onmousedown={(e) => e.preventDefault()} class="object-cover w-full h-full rounded-lg absolute top-0 left-0" />
					{/if}
				</div>
			</Card.Content>
			<Card.Footer class="flex justify-between gap-6">
				<Button variant="outline" size="icon" class="mt-0">
					<BookmarkIcon class="size-4" />
				</Button>
				<Button href={`/jobs/${job.id}`} class="bg-black hover:bg-black/80">View</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>