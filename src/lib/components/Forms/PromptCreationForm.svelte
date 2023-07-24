<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { writable } from 'svelte/store';

    import { notifySuccess } from '$utils/toast';
    import {PromptValidationSchema} from '$utils/validation/promptValidationSchema';

    import promptsStore from '$stores/promptsStore';
    import tagsStore from '$stores/tagStore';

    import TagSelector from '$components/Filters/TagSelector.svelte';
    import SubmitButton from '$components/Forms/SubmitButton.svelte';
    import TextArea from '$components/Forms/TextArea.svelte';
    import TextInput from '$components/Forms/TextInput.svelte';
    import BaseModal from '$components/Modals/BaseModal.svelte';
    import FavoriteToggleBtn from '$components/Prompts/FavoriteToggleBtn.svelte';

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

    const { form, errors, enhance } = superForm(promptCreationFormData, {
        id: 'createPrompt',
        resetForm: true,
        taintedMessage: null,
        validators: PromptValidationSchema,

        onUpdated: ({ form }) => {
            if (form.valid) {
                const { title, text, isFavorited } = form.data;

                promptsStore.createPrompt({
                    title,
                    text,
                    isFavorited,
                    tagIds: $selectedTagIds,
                });

                notifySuccess('Prompt successfully created!', {
                    target: 'baseModal',
                });

                resetFormFields();
            }
        },
    });
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

            <SubmitButton title="Add prompt" />
        </footer>
    </form>
</BaseModal>
