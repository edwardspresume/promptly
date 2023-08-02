<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { writable } from 'svelte/store';

    import { notifyError, notifySuccess } from '$dashboardUtils/toast';
    import { PromptValidationSchema } from '$dashboardUtils/validation/promptValidationSchema';

    import promptsStore from '$dashboardStores/promptsStore';
    import tagsStore from '$dashboardStores/tagStore';

    import TagSelector from '$dashboardComponents/Filters/TagSelector.svelte';
    import SubmitButton from '$dashboardComponents/Forms/SubmitButton.svelte';
    import TextArea from '$dashboardComponents/Forms/TextArea.svelte';
    import TextInput from '$dashboardComponents/Forms/TextInput.svelte';
    import BaseModal from '$dashboardComponents/Modals/BaseModal.svelte';
    import FavoriteToggleBtn from '$dashboardComponents/Prompts/FavoriteToggleBtn.svelte';

    export let promptCreationModalRef: HTMLDialogElement;
    export let promptCreationFormData;

    const totalNumberOfTags = tagsStore.totalTagCount;

    // Boolean to track if the prompt is marked as favorite
    let isFavorited = false;

    // Writable store to keep track of the selected tags by their IDs
    let selectedTagIds = writable<number[]>([]);

    /**
     * Reset the form fields after a successful submission
     */
    const resetFormFields = () => {
        isFavorited = false;

        if ($selectedTagIds.length > 0) selectedTagIds.set([]);
    };

    const { form, errors, delayed, enhance } = superForm(
        promptCreationFormData,
        {
            id: 'createPrompt',
            resetForm: true,
            taintedMessage: null,
            validators: PromptValidationSchema,

            onUpdated: ({ form }) => {
                if (form.valid) {
                    const { title, text, isFavorited } = form.data;

                    try {
                        promptsStore.createPrompt({
                            title,
                            text,
                            isFavorited,
                            tagIds: $selectedTagIds,
                        });

                        notifySuccess('Prompt successfully created!', {
                            target: 'baseModal',
                        });
                    } catch (error) {
                        console.error(error);

                        notifyError('Failed to create prompt', {
                            target: 'baseModal',
                        });
                    }

                    resetFormFields();
                }
            },
        }
    );
</script>

<BaseModal modalTitle="New prompt" bind:dialogElement={promptCreationModalRef}>
    <form
        use:enhance
        method="POST"
        action="?/createPrompt"
        aria-label="Prompt Creation form"
        class="grid gap-4"
    >
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
            class="flex pt-5 mt-6 border-t gap-7 border-white/10 justify-evenly"
        >
            <FavoriteToggleBtn
                {isFavorited}
                iconSize={26}
                on:favoriteToggled={({ detail }) =>
                    (isFavorited = detail.isFavorited)}
            />

            <SubmitButton title="Add prompt" disabled={$delayed} />
        </footer>
    </form>
</BaseModal>
