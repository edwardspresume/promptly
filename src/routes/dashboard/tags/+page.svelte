<script lang="ts">
	import { tagSortOptions } from '$dashboardData/SortOptions';

	import type { ConfirmationInfo } from '$dashboardTypes';

	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SortSelector from '$dashboardComponents/filters/SortSelector.svelte';
	import ConfirmationModal from '$dashboardComponents/modals/ConfirmationModal.svelte';
	import TagList from '$dashboardComponents/tags/TagList.svelte';

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

<TagList on:deleteTag={handleDeleteTagEvent} />

<ConfirmationModal
	bind:confirmationModalRef
	confirmationInfo={confirmationModalInfoForTagDeletion}
/>
