<script lang="ts">
  import { onMount } from 'svelte';
  import { buildDebouncer } from '$lib/utils';
  import {CheckIcon, ChevronDownIcon} from "lucide-svelte";

  import { CircleAlert } from 'lucide-svelte';

  let {
      maxlength = undefined,
      showcounter: showCounter = true,
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
      autovalidate: autoValidate = false,
      size = 'md',
      options = $bindable([]),
      filteredoptions: filteredOptions = $bindable([]),
      emptymessage = "Nothing here.",
      showdropdown: showDropdown = $bindable(false),
      focusedelement: focusedElement = 0,
      disabled = $bindable(false),

      validate = (value: string) => true,
      transform = (value: string) => value,
      filter = (options: { id: string, value: string }[], filterTerm: string) => {
        return options.filter((option) => option.value.toLowerCase().includes(filterTerm.toLowerCase()));
      },

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
      autovalidate?: boolean;
      size?: 'md' | 'lg';
      emptymessage?: string;
      options: {id: string, value: string}[];
      filteredoptions: {id: string, value: string}[];
      showdropdown: boolean;
      focusedelement: number;
      disabled: boolean;

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
      filter?: (options: { id: string, value: string }[], filterTerm: string) => { id: string; value: string; }[];

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
      filteredOptions = options;
      runFilter(buffer, true, true);

      if (props.onfocus) {
        props.onfocus(e);
      }
    },
    onblur: (e: Event) => {
      focus = false;
      showDropdown = false;

      const bufferValue = options.find((o) => o.value.toLowerCase() === buffer.toLowerCase())?.value ?? null;
      if (bufferValue !== null) {
        setValue(bufferValue);
      } else {
        buffer = options.find((o) => o.value.toLowerCase() === value.toLowerCase())?.value ;
      }

      if (props.onblur) {
        props.onblur(e);
      }
    },
    oninput: (e: InputEvent) => {
      runFilter(e?.target?.value ?? '');

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

  console.log(value);

  let buffer = $state(options.find((o) => o.id === value)?.value ?? '');
  let displayedErrorMessage = $derived(error);
  let length = $derived(buffer.length);
  let input: HTMLInputElement | null = $state(null);

  $effect(() => {
    setValue(buffer);
  });

  $effect(() => {
    setBuffer(value);
  });

  function setValue(buffer: string) {
    const id = options.find((o) => o.value === buffer)?.id;
    if (id) {
      value = id;
      dispatch.onchange(id);
    }
  }

  function setBuffer(value: string) {
    buffer = options.find((o) => o.id === value)?.value ?? '';
  }

  function runFilter(search: string, show = true, allOptions = false) {
    if (focus && show) {
      showDropdown = true;
    }

    if (!showDropdown) {
      return;
    }

    const indexedOptions = options.map((option, index) => ({...option, index}));
    if (search === '' || allOptions) {
      // add index to each option
      filteredOptions = indexedOptions;
    } else {
      filteredOptions = filter(indexedOptions, search ?? '');
      focusedElement = Math.min(Math.max(focusedElement, 0), filteredOptions.length - 1);
    }
  }

  function checkValidity(submit = false) {
    // check if value is in options
    if (options && !options.find((o) => o.id === value) && value !== '') {
      valid = false;
      error = 'Invalid value';
    }

    if (autoValidate || submit) {
      if (required && value.length === 0) {
        valid = false;
        error = 'Required';
      } else {
        try {
          valid = validate(value);
        } catch (e) {
          valid = false;
          error = e.message;
        }
      }
    }

    if (valid) {
      error = '';
    }

    return valid;
  }

  function handleKeys(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      focusedElement = (focusedElement + 1) % filteredOptions.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      focusedElement = (focusedElement - 1 + filteredOptions.length) % filteredOptions.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      buffer = filteredOptions[focusedElement].value;
      setValue(buffer);
      e.preventDefault();
    }

    // get the focusedElement of the dropdown element and scroll it into view
    const dropdown = document.getElementById('dropdown');
    const focused = dropdown?.querySelector(`div[data-dropdown-index="${focusedElement}"]`);
    focused?.scrollIntoView({block: 'nearest'});
  }

  onMount(() => {
    if (input) {
      input.submit = submit;
    }
  });

  // returns a boolean indicating whether the input is valid
  function submit() {
    return checkValidity(true);
  }
</script>

<div
  class="{props.class ?? ''} relative group"
  onmousedown={() => input?.focus()}
  onclick={() => {
    input?.focus();
  }}
  aria-label={true}
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
      class="area-style flex m-0 p-0 hover:cursor-text items-center overflow-hidden"
      class:disabled={disabled}
      class:input-focus={focus}
      class:input-error={!valid}
    >
      {#if props.before}
        {@render props.before()}
      {/if}
      <input
        bind:this={input}
        class:disabled={disabled}
        class="overflow-hidden text-surface-8 placeholder-surface-4 text-sm m-0 p-0 grow w-auto border-none bg-surface-0 bg-opacity-0 outline-none focus:ring-0"
        oninvalid={dispatch.oninvalid}
        onfocus={dispatch.onfocus}
        onblur={dispatch.onblur}
        onclick={dispatch.onclick}
        oninput={dispatch.oninput}
        onsubmit={dispatch.onsubmit}
        disabled={disabled}
        readonly={disabled}
        tabindex={disabled ? -1 : 0}
        onkeydown={handleKeys}
        bind:value={buffer}
        {placeholder}
        {name}
        data-form-element="textinput"
      />
      <div class:rotate-[180deg]={showDropdown} class:rotate-0={!focus} class="transition-all">
        <ChevronDownIcon class="w-5 h-5 text-surface-6"/>
      </div>
    </div>
    {#if showDropdown}
    <div tabindex="-1" id="dropdown" class="absolute top-[105%] bg-white border rounded-lg py-2.5 border-surface-2 z-50 w-full max-h-64 overflow-y-scroll">
      {#each filteredOptions as option, i}
      <div
        data-dropdown-index={i}
        class="text-sm flex items-center  gap-2.5 text-left w-full p-2.5 hover:bg-accent-1 hover:text-accent-9 transition-colors"
        class:bg-accent-1={i === focusedElement}
        class:text-accent-9={i === focusedElement}
        class:text-surface-6={i !== focusedElement}
        class:font-normal={value !== option.id}
        class:font-medium={value === option.id}
        onmousedown={() => {
          showDropdown = false;
          setValue(option.value);
          buffer = option.value;
          focusedElement = i;
          input?.focus();
        }}
      >
        <div class="w-6 h-6 flex items-center justify-center">
          {#if value === option.id}
          <CheckIcon class="w-[20px] h-[20px]"/>
          {/if}
        </div>
        <p> {option.value}</p>
      </div>
      {:else}
      <div class="flex gap-2.5 text-sm text-surface-6 text-left w-full p-2.5">{emptymessage}</div>
      {/each}
    </div>
    {/if}
    {#if maxlength && showCounter}
    <div
      class:opacity-100={focus}
      class:opacity-0={!focus}
      class="text-xs text-right text-surface-3 absolute top-0.5 transition-opacity"
      class:right-2={label.length === 0}
      class:right-0={label.length > 0}
    >
      {length} / {maxlength}
    </div>
    {/if}
    {#if displayedErrorMessage}
			<div class="flex items-center mt-1">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{displayedErrorMessage}</span>
			</div>
		{/if}
  </label>
</div>

<style>
  .area-style {
    @apply invalid:border-red-500 font-light bg-surface-0/25 border border-surface-3 text-surface-10 text-sm rounded-lg ring-0 w-full p-2.5 transition-all hover:border-accent-5;
  }

  .area-style.input-error {
    @apply border-red-500 ring-red-500 ring-opacity-50;
  }

  .area-style.disabled {
    @apply bg-surface-2 text-surface-6 cursor-not-allowed border-surface-4;
  }

  .input-focus {
    @apply ring-2 ring-accent-5 border-accent-5 ring-opacity-50;
  }

  input.disabled {
    /*    no mouse events on disabled inputs */
    pointer-events: none;
  }
</style>
