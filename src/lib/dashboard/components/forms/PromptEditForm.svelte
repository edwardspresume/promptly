<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	import type { ConfirmationInfo } from '$dashboardTypes';
	import type { PromptSchema } from '$databaseDir/schema';

	import {
		MAX_PROMPT_DESCRIPTION_LENGTH,
		MAX_PROMPT_TITLE_LENGTH,
		PromptsValidationSchema
	} from '$dashboardValidationSchemas/promptsValidationSchema';

	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { getNotificationFunction } from '$dashboardUtils/toastUtils';

	import { userPromptsStore } from '$dashboardStores/userPromptsStore';
	import { totalTagsCountStore } from '$dashboardStores/tagsStore';

	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import DeleteItemBtn from '$dashboardComponents/list/DeleteItemBtn.svelte';
	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import CopyPromptDescriptionBtn from '$dashboardComponents/prompts/CopyPromptDescriptionBtn.svelte';
	import FavoriteToggleBtn from '$dashboardComponents/prompts/FavoriteToggleBtn.svelte';
	import PromptVisibilitySelector from '$dashboardComponents/prompts/PromptVisibilitySelector.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let promptEditModalRef: HTMLDialogElement;
	export let selectedPromptForEdit: PromptSchema | undefined = undefined;

	const userSession = $page.data.session?.user;

	let confirmationModalRef: HTMLDialogElement;
	let promptDeleteConfirmationInfo: ConfirmationInfo;

	let selectedTagIds: string[] | null = [];

	let previousPrompt: PromptSchema | undefined = undefined;
	let isPromptModified = false;

	let formAction: string = '';
	let refinedPrompt: string = '';
	let resetRefinedPromptDisplay = () => {};
	let isRefinedPromptVisible: boolean = false;

	/**
	 * Function to check if two arrays are different
	 * @param {string[]} newTagIds - The array of new tag IDs.
	 * @param {string[]} existingTagIds - The array of existing tag IDs.
	 * @returns {boolean} - Returns true if arrays are different, otherwise false
	 */
	function areArraysDifferent(newTagIds: string[] | null, existingTagIds: string[] | null) {
		return (
			newTagIds?.length !== existingTagIds?.length ||
			!newTagIds?.every((id) => existingTagIds?.includes(id))
		);
	}

	/**
	 * Deletes the prompt either from the database or from the local storage,
	 * depending on whether the user is logged in.
	 * @async
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The alert type and text of the delete operation.
	 */
	async function deletePromptCallBack(): ReturnType<ConfirmationInfo['callback']> {
		promptEditModalRef.close();

		try {
			if (userSession) {
				const { error } = await $page.data.supabase
					.from('prompts_table')
					.delete()
					.eq('id', $form.id);

				if (error) throw new Error(`Supabase error`);
			} else {
				promptLocalStorageManager.deleteItem($form.id);
			}

			return { alertType: 'success', alertText: 'Prompt deleted successfully!' };
		} catch (e) {
			console.error('Failed to delete prompt');

			return {
				alertType: 'error',
				alertText: 'Failed to delete prompt. Please try again later'
			};
		}
	}

	/**
	 * Deletes the selected prompt.
	 * Calls the deletePrompt method from the promptStore.
	 * Closes the edit modal upon completion.
	 */
	function deletePrompt() {
		promptDeleteConfirmationInfo = {
			heading: `Delete Prompt`,
			subheading: `Are you sure you want to permanently delete prompt: <em style="color: red;">${selectedPromptForEdit?.title}</em>? This action cannot be undone.`,
			callback: deletePromptCallBack
		};

		confirmationModalRef.showModal();
	}

	const { enhance, form, errors, delayed, message } = superForm($page.data.promptForm, {
		id: 'updatePrompt',
		taintedMessage: null,
		validators: PromptsValidationSchema,

		onSubmit: ({ action }) => (formAction = action.search),

		onUpdated: ({ form }) => {
			if (!$message) return;

			const { alertType, alertText, refinedPrompt: refinedPromptValue } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			if (formAction === '?/refinePrompt' && alertType === 'success') {
				refinedPrompt = refinedPromptValue;
				isRefinedPromptVisible = true;
				return;
			}

			if (alertType === 'success') {
				const { id, title, description, isFavorited, tagIds } = form.data;

				if (!userSession) {
					promptLocalStorageManager.updateItem(id, {
						title,
						description,
						isFavorited,
						tagIds
					});
				}

				selectedPromptForEdit =
					$userPromptsStore.find((prompt) => prompt.id === id) ?? selectedPromptForEdit;
			}

			notificationFunction(alertText, { target: 'baseModal' });
		}
	});

	// Watch if selectedPromptForEdit is changed, and populate the form if it has
	$: if (selectedPromptForEdit && selectedPromptForEdit !== previousPrompt) {
		const { id, title, description, isFavorited, tagIds, visibility } = selectedPromptForEdit;

		$form.id = id;
		$form.title = title;
		$form.description = description;
		$form.isFavorited = isFavorited;
		selectedTagIds = tagIds;
		$form.visibility = visibility;

		previousPrompt = selectedPromptForEdit;

		isRefinedPromptVisible = false;

		resetRefinedPromptDisplay = () => {
			isRefinedPromptVisible = false;
			refinedPrompt = '';
		};
	} else {
		resetRefinedPromptDisplay = () => {};
	}

	// Watch if the prompt is changed, and set 'isPromptModified' accordingly
	$: if (selectedPromptForEdit) {
		isPromptModified =
			$form.title.trim() !== selectedPromptForEdit.title ||
			$form.description.trim() !== selectedPromptForEdit.description ||
			$form.isFavorited !== selectedPromptForEdit.isFavorited ||
			$form.visibility !== selectedPromptForEdit.visibility ||
			areArraysDifferent(selectedTagIds, selectedPromptForEdit.tagIds);
	}

	$: isRefiningPrompt = formAction === '?/refinePrompt' && $delayed;
	$: isUpdatingPrompt = formAction === '?/createOrUpdatePrompt' && $delayed;
</script>

<BaseModal
	modalTitle="Edit prompt"
	bind:dialogElement={promptEditModalRef}
	on:close={resetRefinedPromptDisplay}
>
	<form use:enhance method="POST" action="?/createOrUpdatePrompt" class="grid gap-5">
		<input type="hidden" name="id" value={$form.id} />

		<InputField
			type="text"
			name="title"
			label="Title"
			placeholder="Update prompt title"
			bind:value={$form.title}
			errorMessage={$errors.title}
			maxlength={MAX_PROMPT_TITLE_LENGTH}
		/>

		{#if isRefinedPromptVisible}
			<fieldset transition:fade={{ delay: 250, duration: 300 }} class="grid gap-1 textAreaGrid">
				<div class="flex justify-end gap-2 buttonControl">
					<Button
						type="button"
						on:click={() => {
							$form.description = refinedPrompt;
							isRefinedPromptVisible = false;
						}}
						class="p-1 text-xs bg-green-500 w-fit h-fit hover:bg-green-600"
					>
						Accept
					</Button>

					<Button
						type="button"
						on:click={() => (isRefinedPromptVisible = false)}
						class="p-1 text-xs bg-red-500 rounded w-fit h-fit hover:bg-red-600"
					>
						Discard
					</Button>
				</div>

				<TextArea
					rows="6"
					label="Improved Prompt"
					placeholder="Improved Prompt"
					errorMessage={undefined}
					bind:value={refinedPrompt}
					maxlength={MAX_PROMPT_DESCRIPTION_LENGTH}
				/>
			</fieldset>
		{/if}

		<fieldset class="grid gap-1 textAreaGrid">
			{#if selectedPromptForEdit && selectedPromptForEdit.description.length >= 10}
				<Button
					formaction="?/refinePrompt"
					disabled={isRefiningPrompt}
					class="p-1 text-xs bg-blue-500 buttonControl justify-self-end w-fit h-fit hover:bg-blue-600"
				>
					{#if isRefiningPrompt}
						<span class="animate-pulse">Refining...</span>
					{:else}
						<span>Refine prompt</span>
					{/if}
				</Button>
			{/if}

			<TextArea
				rows="6"
				name="description"
				label="Description"
				placeholder="Update prompt description"
				bind:value={$form.description}
				errorMessage={$errors.description}
				maxlength={MAX_PROMPT_DESCRIPTION_LENGTH}
			/>
		</fieldset>

		{#if $totalTagsCountStore}
			<TagSelector bind:selectedTagIds />
		{/if}

		<PromptVisibilitySelector promptId={$form.id} bind:promptVisibility={$form.visibility} />

		<footer class="flex items-center gap-2">
			<DeleteItemBtn
				iconSize={26}
				buttonVariant="outline"
				buttonTitle="Delete Prompt"
				on:click={deletePrompt}
				class="h-full p-2"
			/>

			<CopyPromptDescriptionBtn
				iconSize={26}
				buttonVariant="outline"
				promptDescriptionToCopy={$form.description}
				toastNotificationTarget="baseModal"
				class="h-full p-2"
			/>

			<FavoriteToggleBtn
				isFavorited={$form.isFavorited}
				iconSize={26}
				buttonVariant="outline"
				on:favoriteToggled={() => ($form.isFavorited = !$form.isFavorited)}
				class="h-full p-2"
			/>

			<SubmitButton showSpinner={isUpdatingPrompt} disabled={!isPromptModified || isUpdatingPrompt}>
				{isUpdatingPrompt ? 'Saving...' : 'Save'}
			</SubmitButton>
		</footer>
	</form>
</BaseModal>

<ConfirmationModal bind:confirmationModalRef confirmationInfo={promptDeleteConfirmationInfo} />

<style lang="postcss">
	.textAreaGrid {
		grid-template-areas:
			'descriptionLabel buttonControl'
			'errorMessage errorMessage'
			'promptDescription promptDescription';
	}

	.textAreaGrid :global(label) {
		@apply self-end;
		grid-area: descriptionLabel;
	}

	.textAreaGrid :global(.buttonControl) {
		grid-area: buttonControl;
	}

	.textAreaGrid :global(.error-message) {
		grid-area: errorMessage;
	}

	.textAreaGrid :global(textarea) {
		grid-area: promptDescription;
	}
</style>
