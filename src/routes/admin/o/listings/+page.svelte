<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
  import Profile from '$lib/components/Profile.svelte';
</script>

<div class="p-5">
  <h1 class="heading-sm">Create a new job listing.</h1>

  <Profile />
</div>
