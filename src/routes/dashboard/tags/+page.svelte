<script lang="ts">
	import type { PageData } from './$types';

	import { tagSortOptions } from '$dashboardData/SortOptions';
	import { filteredTagsStore, totalTagsCountStore } from '$dashboardStores/tagsStore';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';

	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
	import TagCreationForm from '$dashboardComponents/forms/TagCreationForm.svelte';
	import ListControls from '$dashboardComponents/list/ListControls.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import TagList from '$dashboardComponents/tags/TagList.svelte';

	export let data: PageData;
	$: ({ session, supabase } = data);

	let tagsListRef: HTMLElement;
	let tagCreationModalRef: HTMLDialogElement;
	let confirmationModalRef: HTMLDialogElement;
	let confirmationModalInfoForTagDeletion: ConfirmationInfo;

	/**
	 * Event handler for the deleteTag event on the TagItem component.
	 * Extracts the confirmation info from the event and shows the confirmation modal.
	 * @param {CustomEvent} event - Custom event object containing the confirmation info in its detail property.
	 */
	function handleDeleteTagEvent({ detail }: CustomEvent) {
		confirmationModalInfoForTagDeletion = detail;
		confirmationModalRef.showModal();
	}

	/**
	 * Callback function to delete all tags.
	 * It either sends an HTTP request or deletes it from local storage.
	 */
	async function deleteTagCallBack() {
		if (session !== null) {
			await supabase.from('tags').delete().eq('user_id', session.user.id);
		} else {
			tagLocalStorageManager.deleteAllItems();
		}
	}

	/**
	 * Event handler for the deleteAllItems event on the ItemListControls component.
	 * Sets the confirmation info for deleting all tags and shows the confirmation modal.
	 */
	function handleDeleteAllTagsEvent() {
		confirmationModalInfoForTagDeletion = {
			heading: 'Delete All Tags',
			subheading: 'Are you sure you want to delete All Tags?',
			toastMessage: 'All Tags have been successfully deleted!',
			callback: deleteTagCallBack
		};

		confirmationModalRef.showModal();
	}
</script>

<svelte:head>
	<title>Tag Management</title>
	<meta name="description" content="Manage your tags with ease using our tag management system." />
</svelte:head>

<h1 class="text-xl text-center mb-7">Tag Management</h1>

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="tag" />
	<SortSelector itemType="tag" sortOptions={tagSortOptions} />
</nav>

<TagList bind:tagsListRef on:deleteTag={handleDeleteTagEvent} />

<ListControls
	itemType="tag"
	itemsListRef={tagsListRef}
	totalItems={$totalTagsCountStore}
	displayedItems={$filteredTagsStore.length}
	on:addItem={() => tagCreationModalRef.showModal()}
	on:deleteAllItems={handleDeleteAllTagsEvent}
/>

<ConfirmationModal
	bind:confirmationModalRef
	confirmationInfo={confirmationModalInfoForTagDeletion}
/>

<TagCreationForm bind:tagCreationModalRef />
