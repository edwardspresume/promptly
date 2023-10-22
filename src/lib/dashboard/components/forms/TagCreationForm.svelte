<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

	import { doesTagExist } from '$dashboardStores/userTagsStore';
	import { TAG_NAME_AI_CONTEXT } from '$dashboardUtils/ai_context';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { getNotificationFunction } from '$dashboardUtils/toastUtils';
	import {
		MAX_TAG_NAME_LENGTH,
		TagValidationSchema
	} from '$dashboardValidationSchemas/tagValidationSchema';

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
			if (!$message) return;

			const { alertType, alertText } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			if (alertType === 'success' && !$page.data.session) {
				tagLocalStorageManager.addItem({ name: form.data.name });
			}

			notificationFunction(alertText, { target: 'baseModal' });
		}
	});
</script>

<BaseModal modalTitle="Create Tag" bind:dialogElement={tagCreationModalRef} class="max-w-md">
	<form use:enhance method="POST" aria-label="Tag Creation Form" class="grid gap-5">
		<InputField
			type="text"
			name="name"
			label="Name"
			enterkeyhint="send"
			placeholder="Enter tag name"
			bind:value={$form.name}
			errorMessage={$errors.name}
			maxlength={MAX_TAG_NAME_LENGTH}
			data-aicontext={TAG_NAME_AI_CONTEXT}
			class="enhanceai"
		/>

		<SubmitButton disabled={$delayed}>
			{$delayed ? 'Creating...' : 'Create Tag'}
		</SubmitButton>
	</form>
</BaseModal>
