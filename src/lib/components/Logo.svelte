<script lang="ts">
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { cn } from '$lib/utils';
	import RollerCoaster from 'lucide-svelte/icons/roller-coaster';

  let {
    href = null,
    iconColor = 'text-primary',
    textColor = 'text-foreground',
		iconOnly = false,

    class: className = '',
    ...props
  } : {
    href?: string | null,
    iconColor?: string,
    textColor?: string,
		iconOnly?: boolean,

    class?: string,
    onclick?: (e: MouseEvent) => void,
  } = $props();

  const dispatch = {
    onclick: (e: MouseEvent) => {
      if (props.onclick) {
        props.onclick(e);
      }
    }
  };
</script>

<a {href} onclick={dispatch.onclick} class={cn(className, textColor + " transition-all ring-opacity-0")}>
	<h1 class="text-lg font-semibold flex items-center gap-1">
		<RollerCoaster class={iconColor} />
		{#if !iconOnly}JobFair{/if}
	</h1>
</a>