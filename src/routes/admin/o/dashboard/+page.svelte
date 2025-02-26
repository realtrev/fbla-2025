<script lang="ts">
  import { currentOrganization } from '$lib/pocketbase';

  let {
    breadcrumbList
  } = $props();
</script>

<h1 class="text-2xl font-semibold">Dashboard</h1>
<p class="mt-1 text-muted-foreground">View all your stats in one place.</p>