<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
  import Profile from '$lib/components/Profile.svelte';
</script>

<div class="p-5">
  <h1 class="heading-sm">LOGGED IN!!</h1>

  <p>Hello, {$currentUser?.firstName}</p>

  <h1 class="heading-2xl">Discover!</h1>

  <Profile />
</div>
