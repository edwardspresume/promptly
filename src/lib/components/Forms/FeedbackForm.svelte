<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { FeedbackSchema } from '$utils/validation/feedbackSchema';

    import { isFeedbackModalOpen } from '$stores/FeedbackModalStore';

    import BaseModal from '$components/Modals/BaseModal.svelte';
    import SubmitButton from './SubmitButton.svelte';
    import TextArea from './TextArea.svelte';

    export let feedbackFormData;
    let feedbackModalRef: HTMLDialogElement;

    const { form, errors, enhance } = superForm(feedbackFormData, {
        id: 'feedbackForm',
        resetForm: true,
        taintedMessage: null,
        validators: FeedbackSchema,
    });

    $: if ($isFeedbackModalOpen) feedbackModalRef.showModal();
</script>

<BaseModal
    modalTitle="Feedback"
    bind:dialogElement={feedbackModalRef}
    on:close={() => isFeedbackModalOpen.set(false)}
>
    <h2 class="text-white mb-2">
        Let me know if you experience any issues or have any suggestions to
        improve this site
    </h2>

    <form
        use:enhance
        method="POST"
        action="?/sendFeedback"
        aria-label="Send feedback"
    >
        <TextArea
            name="message"
            label="Message"
            placeholder="Message"
            bind:value={$form.text}
            errorMessage={$errors.text ?? []}
        />

        <SubmitButton />
    </form>
</BaseModal>
