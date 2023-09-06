<script lang="ts">
	import type { ConfirmationInfo } from '$dashboardTypes';
	import type { PromptSchema } from '$databaseDir/schema';
	import type { PageData } from './$types';

	import { totalPromptCountStore } from '$dashboardStores/promptsStore';
	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import PromptCreationForm from '$dashboardComponents/forms/PromptCreationForm.svelte';
	import PromptEditForm from '$dashboardComponents/forms/PromptEditForm.svelte';
	import ListControls from '$dashboardComponents/list/ListControls.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import PromptsFiltersModal from '$dashboardComponents/modals/PromptsFiltersModal.svelte';
	import PromptList from '$dashboardComponents/prompts/PromptList.svelte';
	import TabGroup from '$dashboardComponents/prompts/TabGroup.svelte';

	export let data: PageData;
	$: ({ session, supabase } = data);

	let promptListRef: HTMLElement;
	let promptCreationModalRef: HTMLDialogElement;
	let confirmationModalRef: HTMLDialogElement;
	let promptsFiltersModalRef: HTMLDialogElement;
	let promptEditModalRef: HTMLDialogElement;

	let selectedTabIndex: number = 0;
	let displayedPromptsCount: number;
	let selectedPromptForEdit: PromptSchema;
	let confirmationModalInfoForPromptDeletion: ConfirmationInfo;

	/**
	 * Handles selection of a prompt, preparing it for editing.
	 * @param {CustomEvent} event - The event carrying details of the selected prompt.
	 */
	const handlePromptSelection = (event: CustomEvent) => {
		if (!event.detail) throw new Error('No prompt selected');

		selectedPromptForEdit = event.detail;
		promptEditModalRef.showModal();
	};

	/**
	 * Deletes all prompts either from the database or from the local storage,
	 * depending on whether the user is logged in.
	 * @async
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The status and message of the delete operation.
	 */
	async function deleteAllPromptsCallBack(): ReturnType<ConfirmationInfo['callback']> {
		try {
			if (session !== null) {
				const { error } = await supabase.from('prompts').delete().eq('profile_id', session.user.id);

				if (error) throw new Error(`Supabase error: ${error.message}`);
			} else {
				promptLocalStorageManager.deleteAllItems();
			}

			return {
				statusType: 'success',
				statusMessage: 'All Prompts have been successfully deleted!'
			};
		} catch (e) {
			console.error('Failed to delete all prompts');
			return {
				statusType: 'error',
				statusMessage: 'Failed to delete all prompts. Please try again later'
			};
		}
	}

	/**
	 * Event handler for the deleteAllItems event on the ListControl component.
	 * Sets the confirmation info for deleting all prompts and shows the confirmation modal.
	 */
	function handleDeleteAllPromptsEvent() {
		confirmationModalInfoForPromptDeletion = {
			heading: 'Delete All Prompts',
			subheading: 'Are you sure you want to delete All your Prompts?',
			callback: deleteAllPromptsCallBack
		};

		confirmationModalRef.showModal();
	}
</script>

<svelte:head>
	<title>Promptly</title>
	<meta name="description" content="Promptly Dashboard" />
</svelte:head>

<TabGroup on:tabItemClicked={({ detail }) => (selectedTabIndex = detail.selectedTabIndex)} />

<nav aria-label="Filter prompts" class="flex flex-col gap-3 my-5 sm:flex-row">
	<SearchBar searchTargetType="prompt" />
	<FilterDisplayButton on:showFilters={() => promptsFiltersModalRef.showModal()} />
</nav>

{#if selectedTabIndex === 0}
	<PromptList bind:promptListRef bind:displayedPromptsCount on:editPrompt={handlePromptSelection} />
{:else if selectedTabIndex === 1}
	<PromptList
		bind:promptListRef
		bind:displayedPromptsCount
		isShowingOnlyFavorites={true}
		on:editPrompt={handlePromptSelection}
	/>
{/if}

<ListControls
	itemType="prompt"
	itemsListRef={promptListRef}
	totalItems={$totalPromptCountStore}
	displayedItems={displayedPromptsCount}
	on:addItem={() => promptCreationModalRef.showModal()}
	on:deleteAllItems={handleDeleteAllPromptsEvent}
/>

<PromptsFiltersModal bind:promptsFiltersModalRef />

<ConfirmationModal
	bind:confirmationModalRef
	confirmationInfo={confirmationModalInfoForPromptDeletion}
/>

<PromptCreationForm bind:promptCreationModalRef />

<PromptEditForm bind:promptEditModalRef {selectedPromptForEdit} />
