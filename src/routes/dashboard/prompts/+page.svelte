<script lang="ts">
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';

	import { getFlash } from 'sveltekit-flash-message';

	import type { ConfirmationInfo } from '$dashboardTypes';
	import type { PromptSchema } from '$databaseDir/schema';
	import type { PageData } from './$types';

	import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import { getNotificationFunction } from '$dashboardUtils/toastUtils';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import PromptCreationForm from '$dashboardComponents/forms/PromptCreationForm.svelte';
	import PromptEditForm from '$dashboardComponents/forms/PromptEditForm.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import PromptsFiltersModal from '$dashboardComponents/modals/PromptsFiltersModal.svelte';
	import PromptList from '$dashboardComponents/prompts/PromptList.svelte';
	import TabGroup from '$dashboardComponents/prompts/TabGroup.svelte';

	export let data: PageData;

	let { session, supabase } = data;
	$: ({ session, supabase } = data);

	const flash = getFlash(page);

	$: if ($flash) {
		const { alertType, alertText } = $flash;

		const notificationFunction = getNotificationFunction(alertType);

		notificationFunction(alertText, { target: 'dashboardLayout' });
	}

	let promptCreationModalRef: HTMLDialogElement;
	let confirmationModalRef: HTMLDialogElement;
	let promptsFiltersModalRef: HTMLDialogElement;
	let promptEditModalRef: HTMLDialogElement;

	let selectedTabIndex: number = 0;
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
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The alert type and text of the delete operation.
	 */
	async function deleteAllPromptsCallBack(): ReturnType<ConfirmationInfo['callback']> {
		try {
			if (session !== null) {
				const { error } = await supabase.from('prompts').delete().eq('profile_id', session.user.id);

				if (error) throw new Error(`Supabase error`);
			} else {
				promptLocalStorageManager.deleteAllItems();
			}

			return {
				alertType: 'success',
				alertText: 'All Prompts have been successfully deleted!'
			};
		} catch (e) {
			console.error('Failed to delete all prompts');

			return {
				alertType: 'error',
				alertText: 'Failed to delete all prompts. Please try again later'
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
	<div in:fly={{ x: 100, delay: 50 }} class="grid overflow-hidden">
		<PromptList
			on:addItem={() => promptCreationModalRef.showModal()}
			on:editPrompt={handlePromptSelection}
			on:deleteAllItems={handleDeleteAllPromptsEvent}
		/>
	</div>
{:else if selectedTabIndex === 1}
	<div in:fly={{ x: -100, delay: 50 }} class="grid overflow-hidden">
		<PromptList
			isShowingOnlyFavorites={true}
			on:addItem={() => promptCreationModalRef.showModal()}
			on:editPrompt={handlePromptSelection}
			on:deleteAllItems={handleDeleteAllPromptsEvent}
		/>
	</div>
{/if}

<PromptsFiltersModal bind:promptsFiltersModalRef />

<ConfirmationModal
	bind:confirmationModalRef
	confirmationInfo={confirmationModalInfoForPromptDeletion}
/>

<PromptCreationForm bind:promptCreationModalRef />

<PromptEditForm bind:promptEditModalRef {selectedPromptForEdit} />
