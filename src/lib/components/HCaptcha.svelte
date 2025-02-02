<script lang="ts">
	import { PUBLIC_HCAPTCHA_SITEKEY } from '$env/static/public';
	import { onMount } from 'svelte';
  import { CircleAlert } from 'lucide-svelte';

	let captcha: HTMLDivElement;

  let {
    token = $bindable(null),
    error = $bindable(''),
    label = $bindable(''),

    ...props
  }: {
    token?: string | null;
    error?: string;
    label?: string;

    class?: string;

    onerror?: () => void;
    onverify?: (token: string) => void;
    onsubmit?: (token: string) => void;
    onexpired?: () => void;
    onupdate?: () => void;
  } = $props();

  let displayedErrorMessage = $derived(error);

	function checkValidity(submit: boolean = false) {
		if (token === null) {
			error = 'Please complete the captcha';
			return false;
		}
		error = '';
		if (submit) {
      dispatch.onsubmit(token);
		}
		return true;
	}

	function render() {
		// create a looping function until the captcha is rendered
		const interval = setInterval(() => {
			if (typeof window.hcaptcha === 'undefined') return;
			clearInterval(interval);
			window.hcaptcha.render('captcha-1', {
				sitekey: PUBLIC_HCAPTCHA_SITEKEY,
				// on verify, call the onVerify function
				callback: 'onVerify',
				expiredCallback: 'errorCallback'
			});
		}, 100);
	}

  const dispatch = {
    onerror: () => {},
    onverify: (newToken: string) => {
      token = newToken;

      if (props.onverify) {
        props.onverify(newToken);
      }
    },
    onsubmit: (token: string) => {
      if (props.onsubmit) {
        props.onsubmit(token);
      }
    },
    onexpired: () => {
      token = null;
      if (props.onexpired) {
        props.onexpired();
      }
    },
    onupdate: () => {
      if (props.onupdate) {
        props.onupdate();
      }
    },
  }

	onMount(() => {
		render();
		dispatch.onupdate();

		window.errorCallback = function () {
      dispatch.onerror();
			token = null;
      dispatch.onupdate();
		};

		window.onVerify = function (newToken: string) {
      dispatch.onverify(newToken);
			token = newToken;
      dispatch.onupdate();
		};

		window.expiredCallback = function () {
			dispatch.onexpired();
			token = null;
      dispatch.onupdate();
		};

		captcha.submit = submit;
	});

	function submit() {
		return checkValidity(true);
	}
</script>

<svelte:head>
	<script src="https://js.hcaptcha.com/1/api.js?render=explicit" async defer></script>
</svelte:head>

<div class="{props.class ?? ''} relative group flex items-center">
	<label for={captcha} class="label">
		{#if label}
			<div class="flex justify-between items-center mb-0.5">
        <span class="text-surface-5 text-xs font-medium`">
          {label}<span class="text-red-500">{required ? '*' : ''}</span>
        </span>
			</div>
		{/if}
		<div class="area-style flex m-0 p-0 hover:cursor-text overflow-hidden"></div>
		<div
			bind:this={captcha}
			id="captcha-1"
			class="h-captcha"
			data-form-element="captcha"
			data-callback="onVerify"
			data-expired-callback="expiredCallback"
			data-error-callback="errorCallback"
		></div>
    {#if displayedErrorMessage}
			<div class="flex items-center mt-1">
        <CircleAlert class="text-red-500 h-5 w-5 mr-0.5" />
        <span class="text-red-500 text-sm font-medium h-min translate-y-[0px]">{displayedErrorMessage}</span>
			</div>
		{/if}
	</label>
</div>
