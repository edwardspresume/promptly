<script lang="ts">
	import type { PageData } from './$types';

	import { tagSortOptions } from '$dashboardData/SortOptions';
	import { filteredTagsStore, totalTagsCountStore } from '$dashboardStores/tagsStore';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import type { TagSchema } from '$databaseDir/schema';
	import type { StatusType } from '$globalTypes';

	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
	import TagCreationForm from '$dashboardComponents/forms/TagCreationForm.svelte';
	import TagEditForm from '$dashboardComponents/forms/TagEditForm.svelte';
	import ListControls from '$dashboardComponents/list/ListControls.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import TagList from '$dashboardComponents/tags/TagList.svelte';

	export let data: PageData;
	$: ({ session, supabase } = data);

	let tagListRef: HTMLElement;
	let tagEditModalRef: HTMLDialogElement;
	let selectedTagForEdit: TagSchema;
	let tagCreationModalRef: HTMLDialogElement;
	let confirmationModalRef: HTMLDialogElement;
	let confirmationModalInfoForTagDeletion: ConfirmationInfo;

	/**
	 * Event handler for the deleteTag event on the TagItem component.
	 * Extracts the confirmation info from the event and shows the confirmation modal.
	 * @param {CustomEvent} event - Custom event object containing the confirmation info in its detail property.
	 */
	function handleDeleteSingleTagEvent({ detail }: CustomEvent) {
		confirmationModalInfoForTagDeletion = detail;
		confirmationModalRef.showModal();
	}

	/**
	 * Callback function to delete all tags.
	 * It either deletes all tags from the database or from the local storage depending on the user's authentication status.
	 * @async
	 * @returns {Promise<{statusType: StatusType}>} - The status of the operation.
	 */
	async function deleteAllTagsCallBack(): Promise<{ statusType: StatusType }> {
		try {
			if (session !== null) {
				const { error } = await supabase.from('tags').delete().eq('user_id', session.user.id);
				if (error) throw new Error(`Supabase error: ${error.message}`);
			} else {
				tagLocalStorageManager.deleteAllItems();
			}

			return { statusType: 'success' };
		} catch (e) {
			console.error('Failed to delete all tags');
			return { statusType: 'error' };
		}
	}

	/**
	 * Event handler for the deleteAllItems event on the ListControl component.
	 * Sets the confirmation info for deleting all tags and shows the confirmation modal.
	 */
	function handleDeleteAllTagsEvent() {
		confirmationModalInfoForTagDeletion = {
			heading: 'Delete All Tags',
			subheading: 'Are you sure you want to delete All your Tags?',
			toastMessage: 'All Tags have been successfully deleted!',
			callback: deleteAllTagsCallBack
		};

		confirmationModalRef.showModal();
	}

	/**
	 * Handles the tag selection event and opens the tag edit modal
	 * @param {CustomEvent} event - The custom event triggered on tag selection
	 */
	const handleTagSelection = ({ detail }: CustomEvent) => {
		selectedTagForEdit = detail;
		tagEditModalRef.showModal();
	};
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

<TagList
	bind:tagListRef
	on:editTag={handleTagSelection}
	on:deleteTag={handleDeleteSingleTagEvent}
/>

<ListControls
	itemType="tag"
	itemsListRef={tagListRef}
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

<TagEditForm bind:tagEditModalRef {selectedTagForEdit} />
