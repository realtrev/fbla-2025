<script lang="ts">
	import { buildDebouncer } from '$lib/utils';
  import { onMount } from 'svelte';
	import { CircleAlert } from 'lucide-svelte';

  let {
    maxlength = undefined,
    showcounter = true,
    type: formtype = $bindable('text'),
    value = $bindable(''),
    numeric = false,
    placeholder = '',
    label = '',
    required = false,
    debounce = false,
    debouncetime = 500,
    valid = $bindable(true),
    error = $bindable(''),
    pattern = undefined,
    focus = $bindable(false),
    name = '',
    autoValidate = false,
    size = 'md',

    validate = (value: string) => true,
    transform = (value: string) => value,

    ...props
  }: {
    maxlength?: number | undefined;
    showcounter?: boolean;
    type?: 'email' | 'text' | 'password';
    value?: string;
    numeric?: boolean;
    placeholder?: string;
    label?: string;
    required?: boolean;
    debounce?: boolean;
    debouncetime?: number;
    valid?: boolean;
    error?: string;
    pattern?: string | undefined;
    focus?: boolean;
    name?: string;
    autoValidate?: boolean;
    size?: 'md' | 'lg';

    oninvalid?: (e: Event) => void;
    onfocus?: (e: Event) => void;
    onblur?: (e: Event) => void;
    onclick?: (e: Event) => void;
    oninput?: (e: InputEvent) => void;
    onchange?: (e: Event) => void;
    ondebounce?: (value: string) => void;

    validate?: (value: string) => boolean;
    transform?: (value: string) => string;

    rightLabel?: () => any;
    before?: () => any;
    after?: () => any;

    class?: string;
    inputclass?: string;
  } = $props();

  const dispatch = {
    onclick: (e: Event) => {
      if (props.onclick) {
        props.onclick(e);
      }
    },

    onfocus: (e: Event) => {
      focus = true;

      if (props.onfocus) {
        props.onfocus(e);
      }
    },

    onblur: (e: Event) => {
      focus = false;

      if (props.onblur) {
        props.onblur(e);
      }
    },

    oninput: (e: InputEvent) => {
      buffer = e?.target?.value ?? '';

      if (autoValidate) {
        checkValidity();
      }

      if (props.oninput) {
        props.oninput(e);
      }
    },

    onchange: (e: Event) => {
      if (props.onchange) {
        props.onchange(e);
      }
    },

    oninvalid: (e: Event) => {
      if (props.oninvalid) {
        props.oninvalid(e);
      }
    },

    ondebounce: (newValue: string) => {
      value = newValue;
      if (props.ondebounce) {
        props.ondebounce(value);
      }
    },

    onsubmit: (e: SubmitEvent) => {
      console.log("submit");
      e.preventDefault();

      if (props.onsubmit) {
        props.onsubmit(e);
      }
    }
  }

	let buffer = $state(value);
  let realValue = $state(buffer);
  let displayedErrorMessage = $derived(error);
  let length = $derived(buffer.length);
	let input: HTMLInputElement | null = $state(null);

  $effect(() => {
    if (buffer !== realValue) {
      buffer = realValue;
    }
  });

  $effect(() => {
    if (valid && !debounce) {
      value = transform(buffer);
    }
  });

  $effect(() => {
    if (valid) {
      error = '';
    }
  });

  $effect(() => {
    if (debounce) {
      debounceCallback(buffer);
    }
  });

	function checkValidity(submit = false) {
		if (autoValidate || submit) {
			if (required && buffer.length === 0) {
				valid = false;
				error = 'Required';
			} else {
				try {
					valid = validate(buffer);
				} catch (e: any) {
					valid = false;
					error = e?.message;
				}
			}
		}

		if (valid) {
			error = '';
		}

		return valid;
	}

	const debounceCallback = buildDebouncer((value: string) => {
    console.log("debounced");
		checkValidity();

    dispatch.ondebounce(value);
		value = transform(buffer);
	}, debouncetime);

  function submit() {
    return checkValidity(true);
  }

  onMount(() => {
    if (input) {
      input.submit = submit;
    }
  });

</script>

<div
	class="{props?.class ?? ''} relative group"
	onmousedown={() => input?.focus()}
	onclick={() => {
		input?.focus();
		focus = true;
	}}
>
	<label for={input} class="label">
		{#if label || props.rightLabel}
			<div class="flex justify-between items-center mb-0.5">
        <span class="text-surface-8 text-sm font-normal">
          {label}<span class="text-red-500">{required ? '*' : ''}</span>
        </span>

        {#if props.rightLabel}
        {@render props.rightLabel()}
        {/if}
			</div>
		{/if}
		<div
			class={`area-style flex m-0 p-0 hover:cursor-text items-center overflow-hidden ${size}`}
			class:input-focus={focus}
			class:input-error={!valid}
		>
      {#if props.before}
        {@render props.before()}
      {/if}
			<input
				bind:this={input}
				class={'overflow-hidden w-full text-surface-8 placeholder-surface-4 m-0 p-0 py-2.5 grow border-none bg-surface-0 bg-opacity-0 outline-none focus:ring-0 ' + (props.inputclass ?? '')}
				oninvalid={dispatch.oninvalid}
				onfocus={dispatch.onfocus}
        onblur={dispatch.onblur}
        onclick={dispatch.onclick}
        oninput={dispatch.oninput}
				onchange={dispatch.onchange}
        onsubmit={dispatch.onsubmit}

        bind:value={realValue}
				{maxlength}
				{placeholder}
				pattern={numeric ? "[0-9]*" : pattern}
        type={formtype}
				{name}
        data-form-element="textinput"
			/>
      {#if props.after}
        {@render props.after()}
      {/if}
		</div>
		{#if maxlength && showcounter}
			<div
				class:opacity-100={focus}
				class:opacity-0={!focus}
				class="text-xs text-right text-surface-3 absolute top-0.5 transition-opacity"
				class:right-2={label.length === 0}
				class:right-0={label.length > 0}
			>
				{length}/{maxlength}
			</div>
		{/if}
    {#if displayedErrorMessage}
			<div class="flex items-top mt-1">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{displayedErrorMessage}</span>
			</div>
		{/if}
	</label>
</div>

<style>
	.area-style {
		@apply invalid:border-red-500 font-light border border-surface-3 text-surface-10 ring-0 w-full px-2.5 transition-all hover:border-accent-5;
	}

  .area-style.md {
    @apply rounded-lg px-2.5;
  }

  .area-style.md > input {
    @apply py-2.5 text-sm font-normal;
  }

  .area-style.lg {
    @apply rounded-xl px-4;
  }

  .area-style.lg > input {
    @apply py-4 text-base font-light;
  }

	.area-style.input-error {
		@apply border-red-500 ring-red-500 ring-opacity-50;
	}

	.input-focus {
		@apply ring-2 ring-accent-5 border-accent-5 ring-opacity-50;
	}
</style>
