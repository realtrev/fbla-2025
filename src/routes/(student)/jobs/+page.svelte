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
	import Loading from '$lib/components/Loading.svelte';

	let jobs = $state([]) as ListingModel[];
	let loading = $state(true);

	onMount(async () => {
		await searchListings("");
	});

	async function searchListings(search) {
		loading = true;
		const response = await pb.collection('listings').getFullList({
			expand: "organization",
			filter: search ? `title ~ '${search}' || organization.name ~ '${search}' || location ~ '${search}'` : ""
		}).catch(() => [] as ListingModel[]);
		if (response && response.length) {
			jobs = response;
			console.log(jobs);
			loading = false;
		}
	}

	const prettyType = {
		'full-time': 'Full Time',
		'part-time': 'Part Time',
		'internship': 'Internship',
		'volunteer': 'Volunteer',
	}

	let debouncer = buildDebouncer((search) => {
		searchListings(search);
	}, 500);

	function oninput(e: Event) {
		debouncer(e.target.value);
	}
</script>

<h1 class="text-2xl font-semibold">Recommended jobs</h1>

<Input placeholder="Search jobs" class="w-full max-w-[32rem] mt-6"oninput={oninput} />

{#if loading}
<div class="w-full h-full py-48 flex items-center justify-center">
	<Loading />
</div>
{:else}
<div class="w-full grid gap-6 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-screen-xl mt-6">
	{#each jobs as job}
		<Card.Root>
			<div class="flex m-6 mb-0 gap-3 items-center">
				{#if job.expand.organization.avatar}
				<img class="size-14 rounded-full pb-1" src={`https://jobfair-fbla-2025.pockethost.io/api/files/${job.expand.organization.collectionId}/${job.expand.organization.id}/${job.expand.organization.avatar}`} alt="business profile" />
				{/if}
				<div class="flex flex-col justify-between items-start">
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
					<div>
						<p class="text-2xl font-semibold z-10 block mt-1 line-clamp-1">{job.title}</p>
					</div>
				</div>
			</div>
			<div class="px-6 pb-6 pt-3">
				<div class="w-full aspect-[4/3] rounded-lg p-6 relative bg-gradient-to-tl from-blue-900 to-teal-500">
					{#if job.thumbnail}
						<img src={job.thumbnail} alt={job.title} onmousedown={(e) => e.preventDefault()} class="object-cover w-full h-full rounded-lg absolute top-0 left-0" />
					{/if}
				</div>
			</div>
			<Card.Footer class="flex justify-between gap-6">
				<Button variant="outline" size="icon" class="mt-0">
					<BookmarkIcon class="size-4" />
				</Button>
				<Button href={`/jobs/${job.id}`} class="bg-black hover:bg-black/80">View</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
{/if}