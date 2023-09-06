<script lang="ts">
	import type { PageData } from './$types';

	import { tagSortOptions } from '$dashboardData/SortOptions';
	import { filteredTagsStore, totalTagsCountStore } from '$dashboardStores/tagsStore';
	import type { ConfirmationInfo } from '$dashboardTypes';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';
	import type { TagSchema } from '$databaseDir/schema';

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
	 * Deletes all tags either from the database or from the local storage,
	 * depending on whether the user is logged in.
	 * @async
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The status and message of the delete operation.
	 */
	async function deleteAllTagsCallBack(): ReturnType<ConfirmationInfo['callback']> {
		try {
			if (session !== null) {
				const { error } = await supabase.from('tags').delete().eq('profile_id', session.user.id);

				if (error) throw new Error(`Supabase error: ${error.message}`);
			} else {
				tagLocalStorageManager.deleteAllItems();
			}

			return { statusType: 'success', statusMessage: 'All Tags have been successfully deleted!' };
		} catch (e) {
			console.error('Failed to delete all tags');
			return {
				statusType: 'error',
				statusMessage: 'Failed to delete all tags. Please try again later'
			};
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
