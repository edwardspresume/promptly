<script lang="ts">
    import tagsStore from '$stores/tagStore';
    import type { ConfirmationInfo } from '$types';

    import StatusMessage from '$components/General/StatusMessage.svelte';
    import ItemCountDisplay from '$components/ListControls/ItemCountDisplay.svelte';
    import ItemListControls from '$components/ListControls/ItemListControls.svelte';
    import ConfirmationModal from '$components/Modals/ConfirmationModal.svelte';
    import TagItem from '$components/Tags/TagItem.svelte';

    const NO_TAGS_AVAILABLE_MESSAGE = 'No tags available. Please add one';
    const NO_MATCH_MESSAGE = 'There are no tags that match your search';

    const filteredTags = tagsStore.filteredTags;
    const totalTagsCount = tagsStore.totalTagCount;

    let tagListRef: HTMLUListElement;
    let confirmationModalRef: HTMLDialogElement;

    let statusMessage: string;
    let displayedTagsCount: number;
    let confirmationModalInfoForTagDeletion: ConfirmationInfo;

    $: displayedTagsCount = $filteredTags.length;

    $: {
        if ($totalTagsCount === 0) statusMessage = NO_TAGS_AVAILABLE_MESSAGE;
        else if (displayedTagsCount === 0) statusMessage = NO_MATCH_MESSAGE;
        else statusMessage = '';
    }

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
     * Event handler for the deleteAllItems event on the ItemListControls component.
     * Sets the confirmation info for deleting all tags and shows the confirmation modal.
     */
    function handleDeleteAllTagsEvent() {
        confirmationModalInfoForTagDeletion = {
            title: 'Are you sure you want to delete All Tags?',
            toastMessage: 'All Tags have been successfully deleted!',
            callback: () => tagsStore.deleteAllTags(),
        };

        confirmationModalRef.showModal();
    }
</script>

{#if statusMessage}
    <StatusMessage message={statusMessage} />
{:else}
    <ItemCountDisplay
        itemType="tag"
        totalItemCount={$totalTagsCount}
        displayedItemCount={displayedTagsCount}
    />

    <ul
        role="list"
        bind:this={tagListRef}
        class="mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
    >
        {#each $filteredTags as tag (tag.id)}
            <TagItem {tag} on:editTag on:deleteTag={handleDeleteTagEvent} />
        {/each}
    </ul>
{/if}

<ItemListControls
    itemType="tag"
    totalItemCount={$totalTagsCount}
    listRef={tagListRef}
    on:addItem
    on:deleteAllItems={handleDeleteAllTagsEvent}
/>

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={confirmationModalInfoForTagDeletion}
/>
