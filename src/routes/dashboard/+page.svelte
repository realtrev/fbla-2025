<script lang="ts">
	import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';

  import { currentUser } from '$lib/pocketbase';
</script>

<div class="p-5">
  <h1 class="heading-sm">LOGGED IN!!</h1>

  <p>Hello, {$currentUser?.name}</p>

  <p>
    {JSON.stringify($currentUser)}
  </p>

  <Button
    label="Log out"
    color="primary"
    class="w-min mt-3"
    size="md"
    onclick={() => goto("/api/logout")}
  />
</div>
