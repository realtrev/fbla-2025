<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';

	import { type ListingModel, type OrganizationModel } from '../../../../../app.js';
	import type { FormSchema } from './applicationForm';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { applicationSchema } from './applicationForm';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let {
		data
	}: {
		data: {
			listing: ListingModel;
			organization: OrganizationModel;
			form: FormSchema;
		};
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(applicationSchema),
		autoFocusOnError: false,
		dataType: 'json',
		validationMethod: 'oninput',
		taintedMessage: 'Are you sure you want to leave?',
		onSubmit: ({ action }) => {
		},
		onResult: ({ result, formElement, cancel }) => {
			console.log("saved", result);
			if (result.type === "success") {
				toast.success("Application sent successfully.");
				window.location.href = `/applications`;
				return;
			}

			if (result.type === "redirect") {
				window.location.href = result.location;
			}

			if (result.type === "failure") {
				if (result?.data?.form?.message) {
					toast.error(result?.data.form.message);
				}
			}

			if (result?.data?.form) {
				$errors = result.data.form.errors;
			} else {
				toast.error("Couldn't send application. Please try again later.");
			}
		},
		resetForm: () => false
	});

	const { form: formData, enhance, isTainted, errors, tainted } = form;
</script>

<form enctype="multipart/form-data" use:enhance method="POST" class="flex items-center justify-center w-full h-full">
	<Card.Root class="max-w-screen-md grow">
		<Card.Header>
			<Card.Title>{data.listing.title}</Card.Title>
			<Card.Description>
				Submit an application below. Your name and school are automatically included.
			</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex flex-col gap-4">
				<Form.Field {form} name="message">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid gap-1">
								<Form.Label class="text-sm" for="message">Message (Optional)</Form.Label>
								<Textarea {...props} id="message" class="w-full h-[300px]" bind:value={$formData.message} />
								<Form.FieldErrors class="text-xs" />
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>

				<Form.Field {form} name="resume">
					<Form.Control>
						{#snippet children({ props })}
							<div class="grid gap-1">
								<Form.Label class="text-sm" for="password">Resume or Transcript</Form.Label>
								<Input {...props} type="file" accept="application/pdf" onchange={(e) => console.log(e)} bind:value={$formData.resume} />
<!--								<Textarea  id="description" class="w-full h-[300px]" bind:value={$formData.description} />-->
								<Form.FieldErrors class="text-xs" />
							</div>
						{/snippet}
					</Form.Control>
				</Form.Field>


				<Form.Button>
					Submit Application
				</Form.Button>
			</div>
		</Card.Content>
	</Card.Root>
</form>