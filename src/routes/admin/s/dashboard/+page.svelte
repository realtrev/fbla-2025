<script lang="ts">
	import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index';

  import { currentUser } from '$lib/pocketbase';
</script>

<div class="p-5">
  <h1 class="heading-sm">LOGGED IN!!</h1>

  <p>Hello, {$currentUser?.name}</p>

  <p>
    {JSON.stringify($currentUser)}
  </p>

  <Button
    onclick={() => goto("/api/logout")}
  >Log out</Button>
</div>
