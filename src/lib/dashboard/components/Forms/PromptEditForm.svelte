<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { fade } from 'svelte/transition';

    import { writable } from 'svelte/store';

    import type { ConfirmationInfo, PromptSchema } from '$dashboardTypes';

    import { notifyError, notifySuccess } from '$dashboardUtils/toast';
    import { PromptValidationSchema } from '$dashboardUtils/validation/promptValidationSchema';

    import promptsStore from '$dashboardStores/promptsStore';

    import TagSelector from '$dashboardComponents/Filters/TagSelector.svelte';
    import TextArea from '$dashboardComponents/Forms/TextArea.svelte';
    import TextInput from '$dashboardComponents/Forms/TextInput.svelte';
    import DeleteItemBtn from '$dashboardComponents/General/DeleteItemBtn.svelte';
    import BaseModal from '$dashboardComponents/Modals/BaseModal.svelte';
    import ConfirmationModal from '$dashboardComponents/Modals/ConfirmationModal.svelte';
    import CopyPromptTextBtn from '$dashboardComponents/Prompts/CopyPromptTextBtn.svelte';
    import FavoriteToggleBtn from '$dashboardComponents/Prompts/FavoriteToggleBtn.svelte';
    import SubmitButton from '$globalComponents/SubmitButton.svelte';
    import { totalTagsCountStore } from '$dashboardStores/tagStore';

    export let promptEditModalRef: HTMLDialogElement;
    export let selectedPromptForEdit: PromptSchema | undefined = undefined;
    export let promptEditFormData;

    const allPrompts = promptsStore.allPrompts;

    let confirmationModalRef: HTMLDialogElement;
    let promptDeleteConfirmationInfo: ConfirmationInfo;

    let selectedTagIds = writable<string[]>([]);
    let previousPrompt: PromptSchema | undefined = undefined;
    let isPromptModified = false;

    let isRefinedPromptVisible: boolean = false;
    let refinedPrompt: string = '';
    let isLoading: boolean = false;

    /**
     * Function to check if two arrays are different
     * @param {string[]} newTagIds - The array of new tag IDs.
     * @param {string[]} existingTagIds - The array of existing tag IDs.
     * @returns {boolean} - Returns true if arrays are different, otherwise false
     */
    function areArraysDifferent(newTagIds: string[], existingTagIds: string[]) {
        return (
            newTagIds.length !== existingTagIds.length ||
            !newTagIds.every((id) => existingTagIds.includes(id))
        );
    }

    /**
     * Deletes the selected prompt.
     * Calls the deletePrompt method from the promptStore.
     * Closes the edit modal upon completion.
     */
    function deletePrompt() {
        // Callback function to delete the prompt and close the modal
        function callback() {
            promptsStore.deletePrompt($form.id);
            promptEditModalRef.close();
        }

        promptDeleteConfirmationInfo = {
            title: 'Are you sure you want to delete this prompt?',
            toastMessage: 'Prompt successfully deleted!',
            callback,
        };

        confirmationModalRef.showModal();
    }

    /**
     * Function to refine the input prompt using the refinePrompt API
     * @returns {Promise<string>} The refined prompt text
     * @throws Will throw an error if the network request fails
     */
    async function getRefinedPrompt() {
        const promptText = $form.text;

        try {
            isLoading = true;

            const response = await fetch('/dashboard/api/refinePrompt', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: promptText,
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            refinedPrompt = await response.text();

            isRefinedPromptVisible = true;

            return refinedPrompt;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';

            notifyError(errorMessage, {
                target: 'baseModal',
            });
        } finally {
            isLoading = false;
        }
    }

    const { form, errors, delayed, enhance } = superForm(promptEditFormData, {
        id: 'updatePrompt',
        taintedMessage: null,
        validators: PromptValidationSchema,

        onUpdated: ({ form }) => {
            if (form.valid) {
                const { id, title, text, isFavorited } = form.data;

                try {
                    promptsStore.updatePrompt(id, {
                        title,
                        text,
                        tagIds: $selectedTagIds,
                        isFavorited,
                    });

                    // Update 'selectedPromptForEdit' with the new prompt data after updating the prompt
                    selectedPromptForEdit =
                        $allPrompts.find((prompt) => prompt.id === id) ??
                        selectedPromptForEdit;

                    notifySuccess('Prompt successfully updated!', {
                        target: 'baseModal',
                    });
                } catch (error) {
                    console.error(error);
                    notifyError('Failed to update prompt', {
                        target: 'baseModal',
                    });
                }
            }
        },
    });

    let resetRefinedPromptDisplay = () => {};

    // Watch if selectedPromptForEdit is changed, and populate the form if it has
    $: if (selectedPromptForEdit && selectedPromptForEdit !== previousPrompt) {
        const { id, title, text, isFavorited, tagIds } = selectedPromptForEdit;

        $form.id = id;
        $form.title = title;
        $form.text = text;
        $form.isFavorited = isFavorited;
        selectedTagIds.set(tagIds ?? []);

        previousPrompt = selectedPromptForEdit;
        isRefinedPromptVisible = false;
        resetRefinedPromptDisplay = () => (isRefinedPromptVisible = false);
    } else {
        resetRefinedPromptDisplay = () => {};
    }

    // Watch if the prompt is changed, and set 'isPromptModified' accordingly
    $: if (selectedPromptForEdit) {
        isPromptModified =
            $form.title.trim() !== selectedPromptForEdit.title ||
            $form.text.trim() !== selectedPromptForEdit.text ||
            $form.isFavorited !== selectedPromptForEdit.isFavorited ||
            areArraysDifferent($selectedTagIds, selectedPromptForEdit.tagIds);
    }
</script>

<BaseModal
    modalTitle="Edit prompt"
    bind:dialogElement={promptEditModalRef}
    on:close={resetRefinedPromptDisplay}
>
    <form use:enhance method="POST" action="?/updatePrompt" class="grid gap-4">
        <input type="hidden" name="id" value={$form.id} />

        <TextInput
            name="title"
            label="Enter prompt title"
            placeholder="Enter prompt title"
            bind:value={$form.title}
            errorMessage={$errors.title ?? []}
        />

        {#if isRefinedPromptVisible}
            <fieldset transition:fade={{ delay: 250, duration: 300 }}>
                <div class="flex justify-end gap-2 mb-2">
                    <button
                        type="button"
                        on:click={() => {
                            $form.text = refinedPrompt;
                            isRefinedPromptVisible = false;
                        }}
                        class="p-1 text-xs text-white transition-colors duration-200 bg-green-500 rounded hover:bg-green-600"
                        >Accept</button
                    >
                    <button
                        type="button"
                        on:click={() => (isRefinedPromptVisible = false)}
                        class="p-1 text-xs text-white transition-colors duration-200 bg-red-500 rounded hover:bg-red-600"
                        >Discard</button
                    >
                </div>

                <TextArea
                    label="Improved Prompt"
                    placeholder="Improved Prompt"
                    bind:value={refinedPrompt}
                    errorMessage={[]}
                />
            </fieldset>
        {/if}

        <fieldset>
            <button
                type="button"
                on:click={getRefinedPrompt}
                disabled={isLoading}
                class="block p-1 mb-2 ml-auto text-xs text-white transition-colors duration-200 bg-blue-500 rounded hover:bg-blue-600"
            >
                {#if isLoading}
                    <span class="animate-pulse">Refining...</span>
                {:else}
                    <span>Refine prompt</span>
                {/if}
            </button>

            <TextArea
                name="text"
                label="Enter prompt text"
                placeholder="Enter prompt text"
                bind:value={$form.text}
                errorMessage={$errors.text ?? []}
            />
        </fieldset>

        {#if $totalTagsCountStore}
            <TagSelector {selectedTagIds} />
        {/if}

        <footer
            class="flex gap-4 pt-5 mt-6 border-t border-white/10 justify-evenly"
        >
            <DeleteItemBtn
                iconSize={26}
                buttonTitle="Delete Prompt"
                on:click={deletePrompt}
            />

            <CopyPromptTextBtn
                iconSize={26}
                promptText={$form.text}
                toastTarget="baseModal"
            />

            <FavoriteToggleBtn
                isFavorited={$form.isFavorited}
                iconSize={26}
                on:favoriteToggled={({ detail }) =>
                    ($form.isFavorited = detail.isFavorited)}
            />

            <SubmitButton
                title="Update prompt"
                disabled={!isPromptModified || $delayed}
            />
        </footer>
    </form>
</BaseModal>

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={promptDeleteConfirmationInfo}
/>
