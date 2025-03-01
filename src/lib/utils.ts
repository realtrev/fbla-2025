import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { writable } from 'svelte/store';
import { page } from '$app/state';
import { deserialize } from '$app/forms';

export function postAction(path: string, options: {
	onSubmit?: (helpers: {
		formData: FormData;
		cancel: () => void;
	}) => void;
	onResult?: (result: {
		action
	}) => void;
	onError?: (e: any) => void;
}) {
	let isSubmitting = writable(false);
	let error = writable(null);

	async function submit(event?: Event, ...args: any[]) {
		event?.preventDefault();
		isSubmitting.set(true);
		error.set(null);

		try {
			const formData = new FormData();
			let cancelled = false;

			options.onSubmit?.({
				formData,
				cancel: () => {
					cancelled = true;
					isSubmitting.set(false);
				},
				...args,
			});

			if (cancelled) return;

			let fullPath = path;
			if (path.startsWith("?")) {
				fullPath = page.url.pathname + "" + path.substring(1);
			}
			const response = await fetch(fullPath, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Get JSON result
			const data = await response.text();
			const action = deserialize(data);

			// Call result handler
			options.onResult?.({ action });
		} catch (err) {
			error.set(err instanceof Error ? err : new Error("Unknown error"));
			if (options.onError) {
				options.onError?.(error);
			}
			throw err;
		} finally {
			isSubmitting.set(false);
		}
	}

	return {
		submit,
		isSubmitting,
		error,
	};
}

export function formatDate(isoString, includeTime = false) {
    const date = new Date(isoString);

    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
    let formattedDate = date.toLocaleDateString('en-US', options);

    if (includeTime) {
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
        formattedDate += `|${date.toLocaleTimeString('en-US', timeOptions)}`;
    }

    return formattedDate;
}


function buildDebouncer(callback: Function, timeout = 300, immediate = false) {
	let timer = 0;
	return (...args: any[]) => {
		if (immediate && !timer) {
			// @ts-ignore
			callback.apply(this, args);
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			// @ts-ignore
			callback.apply(this, args);
		}, timeout);
	};
}

function ellipsisInTheMiddle(str: string, max: number) {
	if (str.length > max) {
		return str.substring(0, max / 2) + '...' + str.substring(str.length - max / 2, str.length);
	}
	return str;
}

function dragAndDropFiles(htmlElement: HTMLElement, callback: (files: FileList) => void, onHoverChange: (hovering: boolean) => void) {
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
		htmlElement.addEventListener(eventName, preventDefaults, false);
	});

	function preventDefaults(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}

	htmlElement.addEventListener('drop', handleDrop, false);

	function handleDrop(e: DragEvent) {
		let dt = e.dataTransfer;
		let files = dt?.files ?? new FileList();
		onHoverChange(false);
		console.log(files);
		callback(files);
	}

	// Additional styling for dragover and dragleave events (optional)
	htmlElement.addEventListener('dragover', () => onHoverChange(true));
	htmlElement.addEventListener('dragleave', () => onHoverChange(false));
}

export async function validateToken(token: string, secret: string) {
	let formData = new FormData();
	formData.append("secret", secret);
	formData.append("response", token);

	const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
	const result = await fetch(url, {
		body: formData,
		method: "POST",
	});

	const outcome = await result.json();
	if (outcome.success) {
		return true;
	}

	return false;
}

class BinarySize {
	readonly _bytes: number;

	public static fromBytes(bytes: number) {
		return new BinarySize(bytes);
	}

	public static fromKilobytes(kilobytes: number) {
		return new BinarySize(kilobytes * 1024);
	}

	public static fromMegabytes(megabytes: number) {
		return new BinarySize(megabytes * 1024 * 1024);
	}

	public static fromGigabytes(gigabytes: number) {
		return new BinarySize(gigabytes * 1024 * 1024 * 1024);
	}

	public static fromTerabytes(terabytes: number) {
		return new BinarySize(terabytes * 1024 * 1024 * 1024 * 1024);
	}

	get bytes() {
		return this._bytes;
	}

	get kilobytes() {
		return this._bytes / 1024;
	}

	get megabytes() {
		return this._bytes / (1024 * 1024);
	}

	get gigabytes() {
		return this._bytes / (1024 * 1024 * 1024);
	}

	get terabytes() {
		return this._bytes / (1024 * 1024 * 1024 * 1024);
	}

	toString() {
		const i = Math.floor(Math.log(this._bytes) / Math.log(1024));
		return (this._bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
	}

	constructor(bytes: number) {
		this._bytes = bytes;
	}
}

class Cookie {
	static createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toUTCString();
		}
		else var expires = "";
		document.cookie = name + "="+value+expires+"; path=/";
	}

	static readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	static eraseCookie(name) {
		createCookie(name,"",-1);
	}
}

export function createEnterKeyHandler(formElement, targetButton) {
	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			const focusedElement = document.activeElement;
			const isButtonOrAnchor =
				focusedElement.tagName === 'BUTTON' || focusedElement.tagName === 'A';
			if (isButtonOrAnchor) return; // Do nothing if the focused element is a button or anchor

			event.preventDefault(); // Prevent the default behavior
			targetButton.click(); // Programmatically click the target button
		}
	}

	// Attach the event listener
	formElement.addEventListener('keydown', handleKeyDown);

	// Return a cleanup function to remove the event listener
	return () => {
		formElement.removeEventListener('keydown', handleKeyDown);
	};
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export { buildDebouncer, ellipsisInTheMiddle, dragAndDropFiles, BinarySize, Cookie };