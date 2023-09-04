<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	import { totalTagsCountStore } from '$dashboardStores/tagsStore';
	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { notifyError, notifySuccess } from '$dashboardUtils/toastUtils';
	import { PromptsValidationSchema } from '$dashboardValidationSchemas/promptsValidationSchema';

	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import FavoriteToggleBtn from '$dashboardComponents/prompts/FavoriteToggleBtn.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';

	export let promptCreationModalRef: HTMLDialogElement;

	// Boolean to track if the prompt is marked as favorite
	let isFavorited = false;

	// Writable store to keep track of the selected tags by their IDs
	let selectedTagIds = writable<string[]>([]);

	/**
	 * Reset the form fields after a successful submission
	 */
	const resetFormFields = () => {
		isFavorited = false;

		if ($selectedTagIds.length > 0) selectedTagIds.set([]);
	};

	const { enhance, form, errors, delayed, message } = superForm($page.data.promptForm, {
		id: 'createPrompt',
		resetForm: true,
		taintedMessage: null,
		validators: PromptsValidationSchema,

		onUpdated: ({ form }) => {
			if ($message.statusType === 'success') {
				if (!$page.data.session?.user) {
					const { title, text, isFavorited } = form.data;

					promptLocalStorageManager.addItem({
						title,
						text,
						isFavorited,
						tagIds: $selectedTagIds
					});
				}

				notifySuccess($message.text, {
					target: 'baseModal'
				});

				resetFormFields();
			} else if ($message.statusType === 'error') {
				notifyError($message.text, {
					target: 'baseModal'
				});
			}
		}
	});
</script>

<BaseModal modalTitle="Create Prompt" bind:dialogElement={promptCreationModalRef}>
	<form
		use:enhance
		method="POST"
		action="?/createOrUpdatePrompt"
		aria-label="Prompt Creation form"
		class="grid gap-5"
	>
		<InputField
			type="text"
			name="title"
			label="Enter prompt title"
			placeholder="Enter prompt title"
			bind:value={$form.title}
			errorMessage={$errors.title}
			labelIsScreenReaderOnly={true}
		/>

		<TextArea
			rows="6"
			name="text"
			label="Enter prompt text"
			placeholder="Enter prompt text"
			bind:value={$form.text}
			errorMessage={$errors.text}
			labelIsScreenReaderOnly={true}
		/>

		{#if $totalTagsCountStore}
			<TagSelector {selectedTagIds} />
		{/if}

		<footer class="flex items-center gap-2">
			<FavoriteToggleBtn
				{isFavorited}
				iconSize={26}
				buttonVariant="outline"
				on:favoriteToggled={() => (isFavorited = !isFavorited)}
				class="h-full p-2"
			/>

			<SubmitButton title={$delayed ? 'Creating...' : 'Create Prompt'} disabled={$delayed} />
		</footer>
	</form>
</BaseModal>
