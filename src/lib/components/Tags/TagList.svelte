<script lang="ts">
    import tagsStore from '$stores/tagStore';
    import type { ConfirmationInfo } from '$types';

    import ItemCountDisplay from '$components/General/ItemCountDisplay.svelte';
    import StatusMessage from '$components/General/StatusMessage.svelte';
    import TagItem from './TagItem.svelte';

    const NO_TAGS_AVAILABLE_MESSAGE = 'Please add a new tag to get started';
    const NO_MATCH_MESSAGE = 'There are no tags that match your search';

    const tags = tagsStore.filteredTags;
    const totalTagsCount = tagsStore.totalTagCount;

    let tagListRef: HTMLUListElement;
    let confirmationModalRef: HTMLDialogElement;

    let statusMessage: string;
    let displayedTagsCount: number;
    let tagDeleteConfirmationInfo: ConfirmationInfo;

    $: displayedTagsCount = $tags.length;

    $: {
        if ($totalTagsCount === 0) statusMessage = NO_TAGS_AVAILABLE_MESSAGE;
        else if (displayedTagsCount === 0) statusMessage = NO_MATCH_MESSAGE;
        else statusMessage = '';
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
        {#each $tags as tag (tag.id)}
            <TagItem {tag} on:editTag />
        {/each}
    </ul>
{/if}
