<script lang="ts">
  import { cn } from '$lib/utils';
  import LoaderCircle from 'lucide-svelte/icons/loader-circle';

  let {
    class: className,

    ...props
  }: {
    class?: string
  } = $props();
</script>

<LoaderCircle {...props} class={cn(className, "animate-spin")} />