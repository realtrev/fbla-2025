<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
  import { Button } from "$lib/components/ui/button";
  import { cn } from '$lib/utils';

  let { children, "aria-label": label,variant = "ghost", ...props }: ComponentProps<typeof Button> =
    $props();
</script>

<Button {variant} {...props} class={cn(props.class)}>
  <ArrowUpDown />
  {label}
</Button>

