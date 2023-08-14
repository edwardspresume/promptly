<script lang="ts">
    import type { ConfirmationInfo } from '$dashboardTypes';

    import {
        filteredTagsStore,
        totalTagsCountStore,
    } from '$dashboardStores/tagStore';
    import { userSessionStore } from '$globalStores/userAndSupabaseStores';

    import {
        deleteAllTagsFromLocalStorage,
        deleteTagFromDatabaseRequest,
    } from '$dashboardUtils/tagLocalStorageMethods';

    import StatusMessage from '$dashboardComponents/General/StatusMessage.svelte';
    import ItemCountDisplay from '$dashboardComponents/ListControls/ItemCountDisplay.svelte';
    import ItemListControls from '$dashboardComponents/ListControls/ItemListControls.svelte';
    import ConfirmationModal from '$dashboardComponents/Modals/ConfirmationModal.svelte';
    import TagItem from '$dashboardComponents/Tags/TagItem.svelte';

    const NO_TAGS_AVAILABLE_MESSAGE = 'No tags available. Please add one';
    const NO_MATCH_MESSAGE = 'There are no tags that match your search';

    let tagItemsContainerRef: HTMLElement;
    let confirmationModalRef: HTMLDialogElement;

    let statusMessage: string;
    let displayedTagsCount: number;
    let confirmationModalInfoForTagDeletion: ConfirmationInfo;

    $: displayedTagsCount = $filteredTagsStore.length;

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
        if ($userSessionStore) {
            await deleteTagFromDatabaseRequest('?/deleteAllTags');
        } else {
            deleteAllTagsFromLocalStorage();
        }
    }

    /**
     * Event handler for the deleteAllItems event on the ItemListControls component.
     * Sets the confirmation info for deleting all tags and shows the confirmation modal.
     */
    function handleDeleteAllTagsEvent() {
        confirmationModalInfoForTagDeletion = {
            title: 'Are you sure you want to delete All Tags?',
            toastMessage: 'All Tags have been successfully deleted!',
            callback: deleteTagCallBack,
        };

        confirmationModalRef.showModal();
    }

    $: {
        if ($totalTagsCountStore === 0)
            statusMessage = NO_TAGS_AVAILABLE_MESSAGE;
        else if (displayedTagsCount === 0) statusMessage = NO_MATCH_MESSAGE;
        else statusMessage = '';
    }
</script>

{#if statusMessage}
    <StatusMessage message={statusMessage} />
{:else}
    <ItemCountDisplay
        itemType="tag"
        totalItemCount={$totalTagsCountStore}
        displayedItemCount={displayedTagsCount}
    />

    <section
        aria-label="List of tags"
        bind:this={tagItemsContainerRef}
        class="mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
    >
        {#each $filteredTagsStore as tag (tag.id)}
            <TagItem {tag} on:editTag on:deleteTag={handleDeleteTagEvent} />
        {/each}
    </section>
{/if}

<ItemListControls
    itemType="tag"
    totalItemCount={$totalTagsCountStore}
    itemContainerRef={tagItemsContainerRef}
    on:addItem
    on:deleteAllItems={handleDeleteAllTagsEvent}
/>

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={confirmationModalInfoForTagDeletion}
/>
