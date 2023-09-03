<script lang="ts">
	import type { PageData } from './$types';

	import { totalPromptCountStore } from '$dashboardStores/promptsStore';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import type { StatusType } from '$globalTypes';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import PromptCreationForm from '$dashboardComponents/forms/PromptCreationForm.svelte';
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
	let confirmationModalInfoForPromptDeletion: ConfirmationInfo;

	/**
	 * Callback function to delete all prompts.
	 * It either deletes all prompts from the database or from the local storage depending on the user's authentication status.
	 * @async
	 * @returns {Promise<{statusType: StatusType}>} - The status of the operation.
	 */
	async function deleteAllPromptsCallBack(): Promise<{ statusType: StatusType }> {
		try {
			if (session !== null) {
				const { error } = await supabase.from('prompts').delete().eq('user_id', session.user.id);
				if (error) throw new Error(`Supabase error: ${error.message}`);
			} else {
				promptLocalStorageManager.deleteAllItems();
			}

			return { statusType: 'success' };
		} catch (e) {
			console.error('Failed to delete all prompts');
			return { statusType: 'error' };
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
			toastMessage: 'All Prompts have been successfully deleted!',
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
	<PromptList bind:promptListRef bind:displayedPromptsCount />
{:else if selectedTabIndex === 1}
	<PromptList bind:promptListRef bind:displayedPromptsCount isShowingOnlyFavorites={true} />
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
