<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import type { TagSchema } from '$dashboardTypes';

    import { notifySuccess } from '$dashboardUtils/toast';
    import { TagValidationSchema } from '$dashboardUtils/validation/tagValidationSchema';

    import tagsStore from '$dashboardStores/tagStore';

    // Import components
    import SubmitButton from '$dashboardComponents/Forms/SubmitButton.svelte';
    import TextInput from '$dashboardComponents/Forms/TextInput.svelte';
    import BaseModal from '$dashboardComponents/Modals/BaseModal.svelte';

    // Props
    export let tagEditModalRef: HTMLDialogElement;
    export let selectedTagForEdit: TagSchema | undefined = undefined;
    export let tagEditFormData;

    const allTags = tagsStore.allTags;

    let previousTag: TagSchema | undefined = undefined;
    let isTagModified: boolean = false;

    // Watch if selectedTagForEdit is changed, and populate the form if it has
    $: if (selectedTagForEdit && selectedTagForEdit !== previousTag) {
        const { id, name } = selectedTagForEdit;

        $form.id = id;
        $form.name = name;

        previousTag = selectedTagForEdit;
    }

    // Watch if the tag name is changed, and set 'isTagModified' accordingly
    $: if (selectedTagForEdit) {
        isTagModified = $form.name.trim() !== selectedTagForEdit.name;
    }

    const { form, errors, delayed, enhance } = superForm(tagEditFormData, {
        id: 'updateTag',
        taintedMessage: null,
        validators: TagValidationSchema,

        onSubmit: ({ data, cancel }) => {
            const name = data.get('name') as string;

            if (tagsStore.doesTagExist(name)) {
                errors.set({
                    name: ['A tag with this name already exists'],
                });

                cancel();
            }
        },

        onUpdated: ({ form }) => {
            if (form.valid) {
                const { id, name } = form.data;

                // Update the tag name in the store
                tagsStore.renameTag(id, name);

                // Update 'selectedTagForEdit' with the new tag name after updating the tag
                selectedTagForEdit =
                    $allTags.find((tag) => tag.id === id) ?? selectedTagForEdit;

                notifySuccess('Tag successfully updated!', {
                    target: 'baseModal',
                });
            }
        },
    });
</script>

<BaseModal modalTitle="Edit tag" bind:dialogElement={tagEditModalRef}>
    <form
        use:enhance
        method="POST"
        action="?/updateTag"
        aria-label="Tag Edit Form"
        class="grid gap-4"
    >
        <input type="hidden" name="id" bind:value={$form.id} />

        <TextInput
            name="name"
            label="Enter new tag name"
            placeholder="Enter new tag name"
            bind:value={$form.name}
            errorMessage={$errors.name ?? []}
        />

        <SubmitButton
            title="Update Tag"
            disabled={!isTagModified || $delayed}
        />
    </form>
</BaseModal>
