<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

	import { doesTagExist } from '$dashboardStores/tagsStore';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';
	import { TagValidationSchema } from '$dashboardValidationSchemas/tagValidationSchema';

	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';

	export let tagCreationModalRef: HTMLDialogElement;

	const { enhance, form, errors, delayed, message } = superForm($page.data.tagForm, {
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
		},

		onUpdated: ({ form }) => {
			if ($message.statusType === 'success') {
				// Create tag in local storage if user is not logged in
				if ($page.data.session === null) {
					const { name } = form.data;
					tagLocalStorageManager.addItem({ name });
				}

				notifySuccess($message.text, {
					target: 'baseModal'
				});
			} else if ($message.statusType === 'error') {
				notifyError($message.text, { target: 'baseModal' });
			}
		}
	});
</script>

<BaseModal bind:dialogElement={tagCreationModalRef} modalTitle="Create Tag">
	<form use:enhance method="POST" aria-label="Tag Creation Form" class="grid gap-4">
		<InputField
			type="text"
			name="name"
			label="Enter tag name"
			placeholder="Enter tag name"
			bind:value={$form.name}
			errorMessage={$errors.name}
			labelIsScreenReaderOnly={true}
		/>

		<SubmitButton title={$delayed ? 'Creating...' : 'Create Tag'} disabled={$delayed} />
	</form>
</BaseModal>
