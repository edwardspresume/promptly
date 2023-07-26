<script lang="ts">
    import { superForm } from 'sveltekit-superforms/client';

    import { notifyError, notifySuccess } from '$utils/toast';
    import { FeedbackSchema } from '$utils/validation/feedbackSchema';

    import { isFeedbackModalOpen } from '$stores/feedbackModalStore';

    import BaseModal from '$components/Modals/BaseModal.svelte';
    import SubmitButton from './SubmitButton.svelte';
    import TextArea from './TextArea.svelte';

    export let feedbackFormData;
    let feedbackModalRef: HTMLDialogElement;

    const { form, errors, delayed, enhance } = superForm(feedbackFormData, {
        id: 'feedbackForm',
        resetForm: true,
        taintedMessage: null,
        validators: FeedbackSchema,

        onUpdated: ({ form }) => {
            if (form.valid) {
                notifySuccess('Message successfully sent! ', {
                    target: 'baseModal',
                });
            }
        },

        onError: () => {
            notifyError('Failed to send feedback email', {
                target: 'baseModal',
            });
        },
    });

    $: if ($isFeedbackModalOpen) feedbackModalRef.showModal();
</script>

<BaseModal
    modalTitle="Feedback"
    bind:dialogElement={feedbackModalRef}
    on:close={() => isFeedbackModalOpen.set(false)}
>
    <form
        use:enhance
        method="POST"
        action="/sendFeedback"
        aria-label="Send feedback"
        class="grid gap-4"
    >
        <h2 class="text-white">
            Let me know if you experience any issues or have any suggestions to
            improve this site
        </h2>

        <TextArea
            name="message"
            label="Message"
            placeholder="Message"
            bind:value={$form.message}
            errorMessage={$errors.message ?? []}
        />

        <SubmitButton disabled={$delayed} />
    </form>
</BaseModal>
