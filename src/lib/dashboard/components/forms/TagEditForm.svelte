<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

	import type { TagSchema } from '$databaseDir/schema';

	import {
		MAX_TAG_NAME_LENGTH,
		TagValidationSchema
	} from '$dashboardValidationSchemas/tagValidationSchema';

	import { allTagsStore, doesTagExist } from '$dashboardStores/tagsStore';

	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { getNotificationFunction } from '$dashboardUtils/toastUtils';

	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';

	// Props
	export let tagEditModalRef: HTMLDialogElement;
	export let selectedTagForEdit: TagSchema | undefined = undefined;

	let previousTag: TagSchema | undefined = undefined;
	let isTagModified: boolean = false;

	// Watch if selectedTagForEdit is changed, and populate the form if it has
	$: if (selectedTagForEdit && selectedTagForEdit !== previousTag) {
		const { id, name } = selectedTagForEdit;

		$form.id = id;
		$form.name = name;

		previousTag = selectedTagForEdit;
	}

	// Watch if the tag name is changed, and set 'isTagModified' accordingly
	$: if (selectedTagForEdit) {
		isTagModified = $form.name.trim() !== selectedTagForEdit.name;
	}

	const { enhance, form, errors, delayed, message } = superForm($page.data.tagForm, {
		id: 'updateTag',
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
			if (!$message) return;

			const { alertType, alertText } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			if (alertType === 'success') {
				const { id, name } = form.data;

				if (!$page.data.session) {
					tagLocalStorageManager.updateItem(id, { name });
				}

				// Update 'selectedTagForEdit' with the new tag name after updating the tag
				selectedTagForEdit = $allTagsStore.find((tag) => tag.id === id) ?? selectedTagForEdit;
			}

			notificationFunction(alertText, { target: 'baseModal' });
		}
	});
</script>

<BaseModal modalTitle="Edit tag" bind:dialogElement={tagEditModalRef}>
	<form use:enhance method="POST" aria-label="Tag Edit Form" class="grid gap-5">
		<input type="hidden" name="id" bind:value={$form.id} />

		<InputField
			type="text"
			name="name"
			label="Name"
			enterkeyhint="send"
			placeholder="Edit tag name"
			bind:value={$form.name}
			errorMessage={$errors.name}
			maxlength={MAX_TAG_NAME_LENGTH}
		/>

		<SubmitButton
			showSpinner={$delayed}
			disabled={!isTagModified || $delayed}
			title={$delayed ? 'Saving...' : 'Save'}
		/>
	</form>
</BaseModal>
