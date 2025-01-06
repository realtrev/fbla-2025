<script lang="ts">
	import { type Component } from 'svelte';
	import { type Icon } from 'lucide-svelte';
	import DynamicButton from '$lib/components/DynamicButton.svelte';

  let {
    label = 'Hello World',
    link = '',
    color = 'primary',
    size = 'md',
    outlined = false,
    notab = false,
    redirectOptions = {},
    leftIcon = null,
    rightIcon = null,
    submit = false,
    reset = false,
    disabled = false,
    ...props
  } : {
    label?: string,
    link?: string,
    color?: 'primary' | 'secondary' | 'accent' | 'white' | 'surface',
    size?: 'sm' | 'md' | 'lg' | 'xl',
    outlined?: boolean,
    notab?: boolean,
    redirectOptions?: { [key: string]: string },
    leftIcon?: Component<{class: string}> | null,
    rightIcon?: Component<{class: string}> | null,
    submit?: boolean,
    reset?: boolean,
    disabled?: boolean,
    class?: string,

    onclick?: (e: MouseEvent) => void,
    onsubmit?: (e: MouseEvent) => void,
  } = $props();

	let className: string;

  const dispatch = {
    onclick: (e: MouseEvent) => {
      if (submit) {
        e.preventDefault();
        if (props.onsubmit) {
          props.onsubmit(e);
        }
        return;
      }

      if (props.onclick) {
        props.onclick(e);
      }
    }
  };

	export { className as class };
</script>

<DynamicButton disabled={disabled} submit={submit} reset={reset} href={link} onclick={dispatch.onclick} tabindex={notab ? '-1' : undefined} class={`button ${color} ${size} ${props.class ?? ''} ${outlined ? 'outlined' : ''}`}>
	{#if leftIcon}
		<svelte:component this={leftIcon} class="w-5 h-5 stroke-2" />
	{/if}
	<p class="text-center">{label}</p>
	{#if rightIcon}
		<svelte:component this={rightIcon} class="w-5 h-5 stroke-2" />
	{/if}
</DynamicButton>