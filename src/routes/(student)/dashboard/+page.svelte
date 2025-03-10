<script lang="ts">
  import { onMount } from 'svelte';

  let loading = $state(true);

  let applicationCount = $state(0);

  onMount(() => {

    loading = false;
  });
</script>

<h1 class="text-2xl font-semibold">Dashboard</h1>
<p class="mt-1 text-muted-foreground">View all your stats in one place.</p>