<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

	import { doesTagExist } from '$dashboardStores/tagsStore';
	import { TagValidationSchema } from '$dashboardValidationSchemas/tagValidationSchema';

	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';

	export let tagCreationModalRef: HTMLDialogElement;

	const { enhance, form, errors, delayed } = superForm($page.data.tagForm, {
		id: 'createTag',
		resetForm: true,
		taintedMessage: null,
		validators: TagValidationSchema,

		onSubmit: ({ formData, cancel }) => {
			const name = formData.get('name') as string;

			if (doesTagExist(name)) {
				errors.set({
					name: ['A tag with this name already exists']
				});

				cancel();
			}
		}
	});
</script>

<BaseModal bind:dialogElement={tagCreationModalRef} modalTitle="Create Tag">
	<form
		use:enhance
		method="POST"
		action="?/createTag"
		aria-label="Tag Creation Form"
		class="grid gap-4"
	>
		<InputField
			type="text"
			name="name"
			label="Enter tag name"
			placeholder="Enter tag name"
			bind:value={$form.name}
			errorMessage={$errors.name}
			labelIsScreenReaderOnly={true}
		/>

		<SubmitButton title="Add Tag" disabled={$delayed} />
	</form>
</BaseModal>
