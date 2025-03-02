<script lang="ts">
	import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button/index';

  import { currentUser } from '$lib/pocketbase';
</script>

<div>
  <h1 class="heading-sm">LOGGED IN!!</h1>

  <p>Hello, {$currentUser?.firstName}</p>
</div>
