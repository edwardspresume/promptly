<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { isFeedbackModalOpen } from '$dashboardStores/feedbackModalStore';
	import { FeedbackValidationSchema } from '$dashboardValidationSchemas/feedbackValidationSchema';

	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';

	export let feedbackFormData;

	let feedbackModalRef: HTMLDialogElement;

	const { enhance, form, errors, delayed } = superForm(feedbackFormData, {
		id: 'feedbackForm',
		resetForm: true,
		taintedMessage: null,
		validators: FeedbackValidationSchema
	});

	$: if ($isFeedbackModalOpen) feedbackModalRef?.showModal();
</script>

<BaseModal
	modalTitle="Feedback"
	modalDescription="Let me know if you experience any issues or have any suggestions to improve this site"
	bind:dialogElement={feedbackModalRef}
	on:close={() => isFeedbackModalOpen.set(false)}
>
	<form
		use:enhance
		method="POST"
		action="/dashboard/sendFeedback"
		aria-label="Send feedback"
		class="grid gap-5"
	>
		<TextArea
			rows="6"
			name="message"
			label="Message"
			placeholder="Message"
			labelIsScreenReaderOnly={true}
			bind:value={$form.message}
			errorMessage={$errors.message}
		/>

		<SubmitButton disabled={$delayed} />
	</form>
</BaseModal>