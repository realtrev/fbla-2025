<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";

  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Sheet from "$lib/components/ui/sheet";
  import Logo from '$lib/components/Logo.svelte';
  import Nav from '$lib/components/navbar/Nav.svelte';

  import { cn } from '$lib/utils';

	let {
		open = $bindable(false),
    items = [],
    class: className
	}: {
	  open?: boolean;
    items: {href: string, title: string, icon: any, badge?: string}[];
    class?: string;
  } = $props();
</script>

<Sheet.Root bind:open>
  <Sheet.Content side="left">
    <Sheet.Header>
      <Sheet.Title><Logo /></Sheet.Title>
    </Sheet.Header>
    <div class="grid gap-4 py-4">
		  <Nav {items} />
    </div>
  </Sheet.Content>
</Sheet.Root>

<nav class={cn(className, "h-full max-h-screen fixed hidden lg:flex flex-col items-center justify-start col text-sm font-medium w-60 border-r grow")}>
  <div class="h-16 border-b w-full flex items-center px-6">
    <Logo />
  </div>

  <Nav {items} />
</nav>