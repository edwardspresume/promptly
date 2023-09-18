<script lang="ts">
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms/client';

	import { totalTagsCountStore } from '$dashboardStores/tagsStore';
	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { getNotificationFunction } from '$dashboardUtils/toastUtils';
	import {
		MAX_PROMPT_DESCRIPTION_LENGTH,
		MAX_PROMPT_TITLE_LENGTH,
		PromptsValidationSchema
	} from '$dashboardValidationSchemas/promptsValidationSchema';

	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import FavoriteToggleBtn from '$dashboardComponents/prompts/FavoriteToggleBtn.svelte';
	import PromptVisibilitySelector from '$dashboardComponents/prompts/PromptVisibilitySelector.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';

	export let promptCreationModalRef: HTMLDialogElement;

	const userSession = $page.data.session?.user;

	// An array to keep track of the selected tags by their IDs
	let selectedTagIds: string[] = [];

	const { enhance, form, errors, delayed, message } = superForm($page.data.promptForm, {
		id: 'createPrompt',
		resetForm: true,
		taintedMessage: null,
		validators: PromptsValidationSchema,

		onUpdated: ({ form }) => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			if (alertType === 'success') {
				if (!userSession) {
					const { title, description, isFavorited, tagIds } = form.data;

					promptLocalStorageManager.addItem({
						title,
						description,
						isFavorited,
						tagIds
					});
				}

				// reset selected tags
				selectedTagIds = [];
				$form.visibility = 'Private';
			}

			notificationFunction(alertText, { target: 'baseModal' });
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
			label="Title"
			placeholder="Enter prompt title"
			bind:value={$form.title}
			errorMessage={$errors.title}
			maxlength={MAX_PROMPT_TITLE_LENGTH}
		/>

		<fieldset class="grid gap-1">
			<TextArea
				rows="6"
				name="description"
				label="Description"
				textAreaId="promptDescription"
				placeholder="Enter prompt description"
				bind:value={$form.description}
				errorMessage={$errors.description}
				maxlength={MAX_PROMPT_DESCRIPTION_LENGTH}
			/>
		</fieldset>

		{#if $totalTagsCountStore}
			<TagSelector bind:selectedTagIds />
		{/if}

		{#if userSession}
			<PromptVisibilitySelector promptId={$form.id} bind:promptVisibility={$form.visibility} />
		{/if}

		<footer class="flex items-center gap-2">
			<FavoriteToggleBtn
				iconSize={26}
				buttonVariant="outline"
				isFavorited={$form.isFavorited}
				on:favoriteToggled={() => ($form.isFavorited = !$form.isFavorited)}
				class="h-full p-2"
			/>

			<SubmitButton disabled={$delayed}>
				{$delayed ? 'Creating...' : 'Create Prompt'}
			</SubmitButton>
		</footer>
	</form>
</BaseModal>
