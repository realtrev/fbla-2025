<script lang="ts">
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { cn } from '$lib/utils';
	import RollerCoaster from 'lucide-svelte/icons/roller-coaster';

  let {
    href = null,
    variant = "small",
		iconOnly = false,

    class: className = '',
    ...props
  } : {
    href?: string | null,
    iconColor?: string,
    textColor?: string,
		iconOnly?: boolean,
    variant?: string,

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


{#if variant === "small"}
  <a {href} onclick={dispatch.onclick} class={cn(className)}>
  	<h1 class="text-lg font-semibold flex items-center gap-1">
  		<RollerCoaster class="text-primary" />
  		{#if !iconOnly}JobFair{/if}
  	</h1>
  </a>
{:else}
  <a {href} onclick={dispatch.onclick} class={cn(className)}>
  	<h1 class="text-2xl font-semibold flex items-center gap-1">
  		<RollerCoaster class="text-primary size-8 stroke-[2]" />
  		{#if !iconOnly}JobFair{/if}
  	</h1>
  </a>
{/if}