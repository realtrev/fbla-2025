<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
  import Profile from '$lib/components/Profile.svelte';
</script>

<div class="p-5">
  <h1 class="heading-sm">Create a listing for a position.</h1>
</div>
