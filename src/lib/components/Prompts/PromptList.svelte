<script lang="ts">
    import promptsStore from '$stores/promptsStore';
    import type { ConfirmationInfo, PromptSchema } from '$types';

    import StatusMessage from '$components/General/StatusMessage.svelte';
    import ItemCountDisplay from '$components/ListControls/ItemCountDisplay.svelte';
    import ItemListControls from '$components/ListControls/ItemListControls.svelte';
    import ConfirmationModal from '$components/Modals/ConfirmationModal.svelte';
    import PromptItem from './PromptItem.svelte';

    export let isShowingOnlyFavorites: boolean = false;

    const NO_PROMPTS_AVAILABLE_MESSAGE = 'No prompts available. Please add one';
    const NO_MATCH_MESSAGE = 'No prompts match your filter criteria';
    const NO_FAVORITE_PROMPTS_MESSAGE =
        'Your favorites list is currently empty';

    const filteredPrompts = promptsStore.filteredPrompts;
    const totalPromptsCount = promptsStore.totalPromptCount;

    let promptItemsContainerRef: HTMLElement;
    let confirmationModalRef: HTMLDialogElement;

    let statusMessage: string;
    let displayedPromptsCount: number;
    let displayedPrompts: PromptSchema[];
    let confirmationModalInfoForPromptDeletion: ConfirmationInfo;

    $: {
        displayedPrompts = isShowingOnlyFavorites
            ? $filteredPrompts.filter((prompt) => prompt.isFavorited)
            : $filteredPrompts;

        displayedPromptsCount = displayedPrompts.length;
    }

    $: {
        if ($totalPromptsCount === 0)
            statusMessage = NO_PROMPTS_AVAILABLE_MESSAGE;
        else if (isShowingOnlyFavorites && displayedPromptsCount === 0)
            statusMessage = NO_FAVORITE_PROMPTS_MESSAGE;
        else if (displayedPromptsCount === 0) statusMessage = NO_MATCH_MESSAGE;
        else statusMessage = '';
    }

    /**
     * Event handler for the deleteAllItems event on the ItemListControls component.
     * Sets the confirmation info for deleting all prompts and shows the confirmation modal.
     */
    function handleDeleteAllPromptsEvent() {
        confirmationModalInfoForPromptDeletion = {
            title: 'Are you sure you want to delete All Prompts?',
            toastMessage: 'All Prompts have been successfully deleted!',
            callback: () => promptsStore.deleteAllPrompts(),
        };

        confirmationModalRef.showModal();
    }
</script>

{#if statusMessage}
    <StatusMessage message={statusMessage} />
{:else}
    <ItemCountDisplay
        itemType="prompt"
        totalItemCount={$totalPromptsCount}
        displayedItemCount={displayedPromptsCount}
    />

    <section
        aria-label="List of prompts"
        bind:this={promptItemsContainerRef}
        class="mt-2 space-y-5 overflow-hidden overflow-y-scroll remove-scrollbar"
    >
        {#each displayedPrompts as prompt (prompt.id)}
            <PromptItem on:editPrompt {prompt} />
        {/each}
    </section>
{/if}

<ItemListControls
    itemType="prompt"
    totalItemCount={$totalPromptsCount}
    itemContainerRef={promptItemsContainerRef}
    on:addItem
    on:deleteAllItems={handleDeleteAllPromptsEvent}
/>

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={confirmationModalInfoForPromptDeletion}
/>
