<script lang="ts">
	import { isFeedbackModalOpen } from '$dashboardStores/feedbackModalStore';

	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';

	let feedbackModalRef: HTMLDialogElement;

	$: if ($isFeedbackModalOpen) feedbackModalRef?.showModal();
</script>

<BaseModal
	modalTitle="Feedback"
	modalDescription="Let me know if you experience any issues or have any suggestions to improve this site"
	bind:dialogElement={feedbackModalRef}
	on:close={() => isFeedbackModalOpen.set(false)}
>
	<form
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
		/>

		<SubmitButton />
	</form>
</BaseModal>
