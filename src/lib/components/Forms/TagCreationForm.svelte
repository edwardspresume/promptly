<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { notifySuccess } from '$utils/toast';
    import { TagValidationSchema } from '$utils/validation/tagValidationSchema';

    import tagsStore from '$stores/tagStore';

    import SubmitButton from '$components/Forms/SubmitButton.svelte';
    import TextInput from '$components/Forms/TextInput.svelte';
    import BaseModal from '$components/Modals/BaseModal.svelte';

    export let tagCreationModalRef: HTMLDialogElement;
    export let tagCreationFormData;

    const { form, errors, enhance } = superForm(tagCreationFormData, {
        id: 'createTag',
        resetForm: true,
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
                const { name } = form.data;

                tagsStore.createTag(name);

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

        <SubmitButton title="Add Tag" />
    </form>
</BaseModal>
