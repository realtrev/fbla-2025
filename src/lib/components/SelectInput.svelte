<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {CheckIcon, ChevronDownIcon} from "lucide-svelte";

    const dispatch = createEventDispatcher();

    export let options: { id: string, value: string}[] = [];
    export let filteredOptions: { id: string, value: string}[] = [];
    export let initial = '';

    export let maxlength: number | undefined = undefined;
    export let showCounter = true;
    export let value = '';
    export let error = '';
    export let disabled = false;
    export let placeholder = '';
    export let label = '';
    export let required = false;
    export let valid = true;
    export let focus = false;
    export let name = '';
    export let showDropdown = false;
    export let focusedElement = 0;

    let timeout: number | undefined = undefined;

    export let autoValidate = false;
    export let filter = (options: { id: string, value: string }[], filterTerm: string) => {
        return options.filter((option) => option.value.toLowerCase().includes(filterTerm.toLowerCase()));
    }
    export let validation = (value: string) => true;

    let buffer = value;
    let input: HTMLInputElement | null = null;

    $: setBuffer(value);
    $: buffer; checkValidity();

    function setBuffer(value: string) {
        buffer = options.find((o) => o.id === value)?.value ?? '';
    }

    $: {
        if (focus) {
            dispatch('focus');
            focusedElement = 0;

            if (timeout) {
                clearTimeout(timeout);
            }

            runFilter(true, true);

        } else {
            showDropdown = false;
            setBuffer(value);
            dispatch('blur');
        }
    }

    $: {
        // if buffer is a key in the options object, then set value to the value of the key
        const bufferValue = options.find((o) => o.value.toLowerCase() === buffer.toLowerCase())?.id ?? null;
        if (bufferValue !== null && bufferValue !== value) {
            value = bufferValue;
            dispatch('change', {value});
        }

        runFilter();
    }

    function runFilter(show = true, allOptions = false) {
        if (focus && show) {
            showDropdown = true;
        }

        if (!showDropdown) {
            return;
        }

        const indexedOptions = options.map((option, index) => ({...option, index}));
        if (buffer === '' || allOptions) {
            // add index to each option
            filteredOptions = indexedOptions;
        } else {
            filteredOptions = filter(indexedOptions, buffer ?? '');
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
            if (required && buffer.length === 0) {
                valid = false;
                error = 'Required';
            } else {
                try {
                    valid = validation(buffer);
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
            e.preventDefault();
        }

        // get the focusedElement of the dropdown element and scroll it into view
        const dropdown = document.getElementById('dropdown');
        const focused = dropdown?.querySelector(`div[data-dropdown-index="${focusedElement}"]`);
        focused?.scrollIntoView({block: 'nearest'});
    }

    onMount(() => {
        input.submit = submit;
    });

    // returns a boolean indicating whether the input is valid
    function submit() {
        return checkValidity(true);
    }
</script>

<div
        class="{$$restProps.class ?? ''} relative group"
        on:mousedown={() => input?.focus()}
        on:click={() => {
		input?.focus();
	}}
>
    <label for={input} class="label">
        {#if label}
            <div class="flex justify-between items-center mb-1">
				<span class="text-surface-8 text-sm font-semibold"
                >{label}<span class="text-red-500">{required ? '*' : ''}</span>{error ? ` - ${error}` : ''}</span
                >
            </div>
        {/if}
        <div
                class="area-style flex m-0 p-0 hover:cursor-text items-center overflow-hidden"
                class:disabled={disabled}
                class:input-focus={focus}
                class:input-error={!valid}
        >
            <slot name="before" />
            <input
                    bind:this={input}
                    class:disabled={disabled}
                    class="overflow-hidden text-surface-8 placeholder-surface-4 text-sm m-0 p-0 grow w-auto border-none bg-surface-0 bg-opacity-0 outline-none focus:ring-0"
                    on:invalid
                    disabled={disabled}
                    readonly={disabled}
                    on:focus={() => (focus = true)}
                    on:blur={() => (focus = false)}
                    tabindex={disabled ? -1 : 0}
                    on:keydown={handleKeys}
                    bind:value={buffer}
                    {placeholder}
                    {name}
                    data-form-element="textinput"
            />
            <div class:rotate-[180deg]={showDropdown} class:rotate-0={!focus} class="transition-all">
                <ChevronDownIcon class="w-5 h-5 text-surface-6" />
            </div>
        </div>
        {#if showDropdown}
            <div tabindex="-1" id="dropdown" class="absolute top-[105%] bg-white border rounded-lg py-2.5 border-surface-2 z-50 w-full max-h-64 overflow-y-scroll">
                {#each filteredOptions as option, i}
                    <div
                            data-dropdown-index={i}
                            class="text-sm flex items-center gap-2.5 text-left w-full p-2.5 hover:bg-accent-1 hover:text-accent-9 transition-colors"
                            class:bg-accent-1={i === focusedElement}
                            class:text-accent-9={i === focusedElement}
                            class:text-surface-6={i !== focusedElement}
                            class:font-semibold={value === option.id}
                            on:mousedown={() => {
                                showDropdown = false;
                                buffer = option.value;
                                input?.focus();
                            }}
                    >
                        <div class="w-6 h-6">
                            {#if value === option.id}
                                <CheckIcon class="w-[20px] h-[20px]" />
                            {/if}
                        </div>
                        <p>{option.value}</p>
                    </div>
                {:else}
                    <div class="flex gap-2.5 text-sm text-surface-6 text-left w-full p-2.5">No listings found.</div>
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
                {length}/{maxlength}
            </div>
        {/if}
    </label>
</div>

<style>
    .area-style {
        @apply invalid:border-red-500 font-medium bg-surface-0/25 border border-surface-3 text-surface-10 text-sm rounded-lg ring-0 w-full p-2.5 transition-all hover:border-accent-5;
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
