<script lang="ts">
  import { page } from '$app/state';

  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";

	let {
    items = []
	}: {
    items: {href: string, title: string, icon: any, badge?: string}[];
  } = $props();
</script>

<nav class="grid h-min text-sm font-medium w-full py-3 px-2 gap-1">
  {#each items as Item}
    {#if page.url.pathname.startsWith(Item.href)}
      <a href={Item.href} class="shadow bg-foreground text-background nav-item">
        <Item.icon class="size-4 mr-1" />
        {Item.title}
        {#if Item.badge}
          <Badge variant="secondary" class="ml-auto font-semibold">{Item.badge}</Badge>
        {/if}
      </a>
    {:else}
      <a href={Item.href} class="font-medium hover:bg-muted text-foreground nav-item">
        <Item.icon class="size-4 mr-1" />
        {Item.title}
        {#if Item.badge}
          <Badge variant="outline" class="ml-auto font-semibold">{Item.badge}</Badge>
        {/if}
      </a>
    {/if}
  {/each}
</nav>

<style>
  .nav-item {
    @apply flex items-center gap-1 px-3 h-10 rounded-md w-full transition-colors;
  }
</style>