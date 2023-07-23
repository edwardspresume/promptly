<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { writable } from 'svelte/store';

    import type { ConfirmationInfo, PromptSchema } from '$types';

    import { notifySuccess } from '$utils/toast';
    import PromptValidationSchema from '$utils/validation/promptValidationSchema';

    import promptsStore from '$stores/promptsStore';
    import tagsStore from '$stores/tagStore';

    import TagSelector from '$components/Filters/TagSelector.svelte';
    import SubmitButton from '$components/Forms/SubmitButton.svelte';
    import TextArea from '$components/Forms/TextArea.svelte';
    import TextInput from '$components/Forms/TextInput.svelte';
    import DeleteItemBtn from '$components/General/DeleteItemBtn.svelte';
    import BaseModal from '$components/Modals/BaseModal.svelte';
    import ConfirmationModal from '$components/Modals/ConfirmationModal.svelte';
    import CopyPromptTextBtn from '$components/Prompts/CopyPromptTextBtn.svelte';
    import FavoriteToggleBtn from '$components/Prompts/FavoriteToggleBtn.svelte';

    export let promptEditModalRef: HTMLDialogElement;

    export let selectedPromptForEdit: PromptSchema | undefined = undefined;
    export let promptEditFormData;

    const allPrompts = promptsStore.allPrompts;
    const totalNumberOfTags = tagsStore.totalTagCount;

    let confirmationModalRef: HTMLDialogElement;

    let promptDeleteConfirmationInfo: ConfirmationInfo;

    let selectedTagIds = writable<number[]>([]);
    let previousPrompt: PromptSchema | undefined = undefined;
    let isPromptModified = false;

    // Watch if selectedPromptForEdit is changed, and populate the form if it has
    $: if (selectedPromptForEdit && selectedPromptForEdit !== previousPrompt) {
        const { id, title, text, isFavorited, tagIds } = selectedPromptForEdit;

        $form.id = id;
        $form.title = title;
        $form.text = text;
        $form.isFavorited = isFavorited;
        selectedTagIds.set(tagIds ?? []);

        previousPrompt = selectedPromptForEdit;
    }

    // Watch if the prompt is changed, and set 'isPromptModified' accordingly
    $: if (selectedPromptForEdit) {
        isPromptModified =
            $form.title.trim() !== selectedPromptForEdit.title ||
            $form.text.trim() !== selectedPromptForEdit.text ||
            $form.isFavorited !== selectedPromptForEdit.isFavorited ||
            areArraysDifferent($selectedTagIds, selectedPromptForEdit.tagIds);
    }

    /**
     * Function to check if two arrays are different
     * @param {number[]} selectedTagIds - Selected tag IDs
     * @param {number[]} existingTagIds - Existing tag IDs
     * @returns {boolean} - Returns true if arrays are different, otherwise false
     */
    function areArraysDifferent(
        selectedTagIds: number[],
        existingTagIds: number[]
    ) {
        return (
            selectedTagIds.length !== existingTagIds.length ||
            !selectedTagIds.every((id) => existingTagIds.includes(id))
        );
    }

    /**
     * Function to delete the selected prompt
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

    const { form, errors, enhance } = superForm(promptEditFormData, {
        id: 'updatePrompt',
        taintedMessage: null,
        validators: PromptValidationSchema,

        onUpdated: ({ form }) => {
            if (form.valid) {
                const { id, title, text, isFavorited } = form.data;

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
            }
        },
    });
</script>

<BaseModal modalTitle="Edit prompt" bind:dialogElement={promptEditModalRef}>
    <form use:enhance method="POST" action="?/updatePrompt" class="grid gap-4">
        <input type="hidden" name="id" value={$form.id} />

        <TextInput
            name="title"
            label="Enter prompt title"
            placeholder="Enter prompt title"
            bind:value={$form.title}
            errorMessage={$errors.title ?? []}
        />

        <TextArea
            name="text"
            label="Enter prompt text"
            placeholder="Enter prompt text"
            bind:value={$form.text}
            errorMessage={$errors.text ?? []}
        />

        {#if $totalNumberOfTags}
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

            <SubmitButton title="Update prompt" disabled={!isPromptModified} />
        </footer>
    </form>
</BaseModal>

<ConfirmationModal
    bind:confirmationModalRef
    confirmationInfo={promptDeleteConfirmationInfo}
/>
