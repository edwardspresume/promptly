<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { derived, writable } from 'svelte/store';

    import { notifySuccess } from '$dashboardUtils/toast';
    import { promptsCrudSchema } from '$databaseDir/promptsCrudSchema';

    import TagSelector from '$dashboardComponents/Filters/TagSelector.svelte';
    import TextArea from '$dashboardComponents/Forms/TextArea.svelte';
    import TextInput from '$dashboardComponents/Forms/TextInput.svelte';
    import BaseModal from '$dashboardComponents/Modals/BaseModal.svelte';
    import FavoriteToggleBtn from '$dashboardComponents/Prompts/FavoriteToggleBtn.svelte';
    import { totalTagsCountStore } from '$dashboardStores/tagStore';
    import { promptLocalStorageManager } from '$dashboardUtils/localStorageManager';
    import SubmitButton from '$globalComponents/SubmitButton.svelte';
    import { userSessionStore } from '$globalStores/userAndSupabaseStores';

    export let promptCreationModalRef: HTMLDialogElement;
    export let promptCreationFormData;

    // Boolean to track if the prompt is marked as favorite
    let isFavorited = false;

    // Writable store to keep track of the selected tags by their IDs
    let selectedTagIds = writable<string[]>([]);
    let selectedTagIdsString = derived(selectedTagIds, ($selectedTagIds) =>
        JSON.stringify($selectedTagIds)
    );

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
            validators: promptsCrudSchema,

            onUpdated: ({ form }) => {
                if (form.valid) {
                    if (!$userSessionStore) {
                        const { title, text, isFavorited } = form.data;

                        promptLocalStorageManager.addItem({
                            title,
                            text,
                            isFavorited,
                            tagIds: $selectedTagIds,
                        });
                    }

                    notifySuccess('Prompt successfully created!', {
                        target: 'baseModal',
                    });

                    resetFormFields();
                }
            },
        }
    );

    $: console.log($selectedTagIdsString);
    $: console.log($errors);
</script>

<BaseModal modalTitle="New prompt" bind:dialogElement={promptCreationModalRef}>
    <form
        use:enhance
        method="POST"
        action="?/createPrompt"
        aria-label="Prompt Creation form"
        class="grid gap-4"
    >
        <!-- <input type="hidden" name="tagIds" bind:value={$selectedTagIdsString} /> -->

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

        {#if $totalTagsCountStore}
            <TagSelector {selectedTagIds} />
        {/if}

        <footer
            class="flex pt-5 mt-6 border-t gap-7 border-white/10 justify-evenly"
        >
            <FavoriteToggleBtn
                context="PromptCreationForm"
                {isFavorited}
                iconSize={26}
                on:favoriteToggled={({ detail }) =>
                    (isFavorited = detail.isFavorited)}
            />

            <SubmitButton title="Add prompt" disabled={$delayed} />
        </footer>
    </form>
</BaseModal>
