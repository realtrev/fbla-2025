<script lang="ts">
	import { onMount } from 'svelte';
	import Check from 'lucide-svelte/icons/check';
  import { Check, CircleAlert, PlusIcon, UploadIcon } from 'lucide-svelte/icons/check';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { BinarySize, dragAndDropFiles, ellipsisInTheMiddle } from '$lib/utils';

  let {
    multiple = false,
    files = $bindable([]),
    file = $bindable(null),
    label = '',
    placeholder = 'Upload a file',
    accept = '*',
    required = false,
    autoValidate = false,
    valid = $bindable(true),
    error = $bindable(),
    focus = $bindable(false),
    disabled = $bindable(false),
    dragdropmessage = "or drag and drop one",

    transform = (value: File[]) => value,
    validate = (value: File[]) => true,

    ...props
  } : {
    multiple?: boolean;
    files?: File[];
    file?: File | null;
    label?: string;
    placeholder?: string;
    accept?: string;
    required?: boolean;
    autoValidate?: boolean;
    valid?: boolean;
    invalid?: boolean;
    error?: string;
    focus?: boolean;
    disabled?: boolean;
    dragdropmessage?: string;

    transform?: (value: File[]) => File[];
    validate?: (value: File[]) => boolean;
    rightLabel?: () => any;

    oninput?: (e: InputEvent) => void;
    onfocus?: (e: FocusEvent) => void;
    onblur?: (e: FocusEvent) => void;
    ondragover?: (e: MouseEvent) => void;
    ondragleave?: (e: MouseEvent) => void;
    ondrop?: (e: MouseEvent) => void;
    onclick?: (e: MouseEvent) => void;

    class?: string;
  } = $props();

	let dragover = $state(false);
  // if multiple is false, file will be the first file in files
  let displayedFiles = $derived<File[]>(files);
  let displayedErrorMessage = $state(error);
	let unfilteredFiles: File[] = $state(multiple ? files : file ? [file] : []);
	let isDragAndDropSupported = $state(false);
	let input: HTMLInputElement | null = null;
	let dragOverArea: HTMLElement | null = null;

  const dispatch = {
    oninput: (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      handleFileUpload(files);
      transformUnfilteredFiles(unfilteredFiles);

      if (autoValidate) {
        checkValidity();
      }

      if (props.oninput) {
        props.oninput(e);
      }
    },

    onclick: (e: MouseEvent) => {
      if (props.onclick) {
        props.onclick(e);
      }
    },

    onfocus: (e: FocusEvent) => {
      focus = true;

      if (props.onfocus) {
        props.onfocus(e);
      }
    },

    onblur: (e: FocusEvent) => {
      focus = false;

      if (props.onblur) {
        props.onblur(e);
      }
    }
  }

	// transform
	function transformUnfilteredFiles(unfilteredFiles: File[]) {
		try {
      if (unfilteredFiles?.length) {
        files = transform(unfilteredFiles);
      } else {
				files = [];
			}
			error = '';
			valid = true;

      if (files.length && !multiple) {
        file = files[0];
      } else {
        file = null;
      }
		} catch (e: any) {
			if (unfilteredFiles?.length) {
				unfilteredFiles = [];
			}
			files = [];
			valid = false;
			error = e.message;
		}
	}

	function checkValidity() {
    if (required && !files.length) {
      valid = false;
			error = 'This field is required';
		} else {
      try {
        valid = validate(files);
        error = '';
      } catch (e: any) {
        valid = false;
        error = e.message;
      }
    }
    displayedErrorMessage = error;
    if (!valid) {
      handleFileUpload(null);
      files = [];
    }

		return valid;
	}

	onMount(() => {
		isDragAndDropSupported =
			'draggable' in document.createElement('div') &&
			'ondragstart' in document.createElement('div') &&
			'ondrop' in document.createElement('div');

		if (!isDragAndDropSupported) {
			console.warn('Drag and drop files is not supported in this browser');
			return;
		}

    if (dragOverArea) {
      dragAndDropFiles(dragOverArea, handleFileUpload, (hovering) => {
        dragover = hovering;
      });
    }

    if (input) {
      input.submit = submit;
    }
	});

  function handleFileUpload(files: FileList | null) {
    if (files === null) {
      unfilteredFiles = [];
      return;
    }

    if (multiple) {
      unfilteredFiles = Array.from(files);
    } else if (files.length) {
      unfilteredFiles = [files[0]];
    } else {
      unfilteredFiles = [];
    }
  }

	function submit() {
    console.log(files);
		return checkValidity();
	}
</script>

<div
	bind:this={dragOverArea}
	class={`${props.class ?? ''} relative group`}
	onclick={() => input?.focus()}
>
	<label for={label} class="label">
		<input
				bind:this={input}
				id={label}
				type="file"
        oninput={dispatch.oninput}
        onclick={dispatch.onclick}
        onfocus={dispatch.onfocus}
        onblur={dispatch.onblur}

				{accept}
				{multiple}
        {disabled}
				data-form-element="textinput"
		/>
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
		<div class:dragover class="area-style hover:cursor-pointer" class:area-error={!valid}>
			<div
				class:button-focus={focus}
				class="button hover:border-accent-5 bg-surface-0/25 transition-all rounded-full border border-surface-2 p-4 mb-1"
			>
				{#if displayedFiles.length}
					<div in:scale={{ duration: 300, delay: 300, opacity: 0.5, easing: cubicOut }}>
						<Check class="text-accent-5 h-6 w-6" />
					</div>
				{:else if dragover}
					<div in:scale={{ duration: 300, delay: 300, opacity: 0.5, easing: cubicOut }}>
						<PlusIcon class="text-accent-5 h-6 w-6" />
					</div>
				{:else}
					<div in:scale={{ duration: 300, delay: 300, opacity: 0.5, easing: cubicOut }}>
						<UploadIcon class="text-accent-5 h-6 w-6" />
					</div>
				{/if}
			</div>
      {#if displayedFiles.length}
        {#if multiple}
          {#each displayedFiles as file}
            <p class="text-surface-8 p">
              {ellipsisInTheMiddle(file.name, 30)}
              <span class="text-surface-5">({BinarySize.fromBytes(file.size).toString()})</span>
            </p>
          {/each}
        {:else}
          <p class="text-surface-8 p">
            {ellipsisInTheMiddle(displayedFiles[0].name, 30)}
            <span class="text-surface-5">({BinarySize.fromBytes(displayedFiles[0].size).toString()})</span>
          </p>
        {/if}
      {:else}
      <p class="text-surface-8 p">
        <span class="text-accent-5 font-semibold">{placeholder}</span>
        <span class:hide={!isDragAndDropSupported}>{dragdropmessage}</span>
      </p>
      {/if}
      {#if displayedErrorMessage}
        <div class="flex items-center mt-0.5">
          <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
          <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{displayedErrorMessage}</span>
        </div>
      {/if}
    </div>
	</label>
</div>

<style>
	.area-style {
		@apply overflow-hidden invalid:border-red-500 flex flex-col items-center font-medium border border-dashed border-surface-3 text-surface-10 text-sm rounded-lg ring-0 w-full p-8 transition-all;
	}

	.button-focus {
		@apply ring-2 ring-accent-5 border-accent-5 ring-opacity-50;
	}

	.area-error {
		@apply border-red-300;
	}

	.button {
		@apply focus:scale-[1.05] duration-500 active:brightness-[120%] whitespace-nowrap hover:scale-[1.05] active:shadow-none active:scale-100 hover:shadow-xl hover:brightness-[105%];
	}

	.button-error {
		@apply bg-red-500 text-surface-0;
	}

	.dragover {
		@apply bg-accent-1 border-accent-5;
	}

	input[type='file'] {
		width: 0;
		height: 0;
		opacity: 0;
		overflow: hidden;
		position: absolute;
	}

	.hide {
		display: none;
	}

	.p {
		@apply text-xs md:text-sm w-full line-clamp-2 lg:line-clamp-1 overflow-hidden text-ellipsis text-center;
	}
</style>
