<script lang="ts">
    import tagsStore from '$stores/tagStore';
    import type { ConfirmationInfo } from '$types';

    import ItemCountDisplay from '$components/General/ItemCountDisplay.svelte';
    import StatusMessage from '$components/General/StatusMessage.svelte';
    import ConfirmationModal from '$components/Modal/ConfirmationModal.svelte';
    import TagItem from './TagItem.svelte';

    const NO_TAGS_AVAILABLE_MESSAGE = 'No tags available. Please add one';
    const NO_MATCH_MESSAGE = 'There are no tags that match your search';

    const filteredTags = tagsStore.filteredTags;
    const totalTagsCount = tagsStore.totalTagCount;

    let tagListRef: HTMLUListElement;
    let confirmationModalRef: HTMLDialogElement;

    let statusMessage: string;
    let displayedTagsCount: number;
    let tagDeleteConfirmationInfo: ConfirmationInfo;

    $: displayedTagsCount = $filteredTags.length;

    $: {
        if ($totalTagsCount === 0) statusMessage = NO_TAGS_AVAILABLE_MESSAGE;
        else if (displayedTagsCount === 0) statusMessage = NO_MATCH_MESSAGE;
        else statusMessage = '';
    }

    /**
     * Shows the confirmation modal for tag deletion
     * @param {CustomEvent} event - Contains detail with confirmation info
     */
    function showTagDeleteConfirmationModal({ detail }: CustomEvent) {
        tagDeleteConfirmationInfo = detail;
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
            <TagItem
                {tag}
                on:editTag
                on:deleteTag={showTagDeleteConfirmationModal}
            />
        {/each}
    </ul>
{/if}

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={tagDeleteConfirmationInfo}
/>
