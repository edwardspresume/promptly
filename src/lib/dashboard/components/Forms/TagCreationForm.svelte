<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { userSessionStore } from '$globalStores/userAndSupabaseStores';

    import {
        addTagToLocalStorage,
        doesTagExist,
    } from '$dashboardUtils/tagLocalStorageMethods';
    import { notifySuccess } from '$dashboardUtils/toast';
    import { TagValidationSchema } from '$dashboardUtils/validation/tagValidationSchema';

    import TextInput from '$dashboardComponents/Forms/TextInput.svelte';
    import BaseModal from '$dashboardComponents/Modals/BaseModal.svelte';
    import SubmitButton from '$globalComponents/SubmitButton.svelte';

    export let tagCreationModalRef: HTMLDialogElement;
    export let tagCreationFormData;

    const { form, errors, delayed, enhance } = superForm(tagCreationFormData, {
        id: 'createTag',
        resetForm: true,
        taintedMessage: null,
        validators: TagValidationSchema,

        onSubmit: ({ formData, cancel }) => {
            const name = formData.get('name') as string;

            if (doesTagExist(name)) {
                errors.set({
                    name: ['A tag with this name already exists'],
                });

                cancel();
            }
        },

        onUpdated: ({ form }) => {
            if (form.valid) {
                // Create tag in local storage if user is not logged in
                if (!$userSessionStore) {
                    const { name } = form.data;
                    addTagToLocalStorage(name);
                }

                notifySuccess('Tag successfully created! ', {
                    target: 'baseModal',
                });
            }
        },
    });
</script>

<BaseModal modalTitle="New tag" bind:dialogElement={tagCreationModalRef}>
    <form
        use:enhance
        method="POST"
        action="?/createTag"
        aria-label="Tag Creation Form"
        class="grid gap-4"
    >
        <TextInput
            name="name"
            label="Enter tag name"
            placeholder="Enter tag name"
            bind:value={$form.name}
            errorMessage={$errors.name ?? []}
        />

        <SubmitButton title="Add Tag" disabled={$delayed} />
    </form>
</BaseModal>
