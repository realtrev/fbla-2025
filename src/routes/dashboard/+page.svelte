<script lang="ts">
	import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index.js';

  import { currentUser } from '$lib/pocketbase';
</script>

<div class="p-5">
  <h1>LOGGED IN!!</h1>

  <p>Hello, {$currentUser?.firstName}</p>

  <p>
    {JSON.stringify($currentUser)}
  </p>

  <Button  onclick={() => goto("/api/logout")}>Log out</Button>
</div>
