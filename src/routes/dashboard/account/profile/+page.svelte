<script lang="ts">
	import type { PageData } from './$types';

	import { superForm } from 'sveltekit-superforms/client';

	import {
		MAX_FULL_NAME_LENGTH,
		MAX_USERNAME_LENGTH,
		ProfileValidationSchema
	} from '$dashboardValidationSchemas/profileValidationSchema';

	import { getNotificationFunction } from '$dashboardUtils/toastUtils';

	import PageSubHeader from '$dashboardComponents/account/PageSubHeader.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';

	export let data: PageData;

	let isProfileModified: boolean = false;

	$: {
		const { username, fullName } = data.profileForm?.data;

		$form.username = $form.username ?? '';
		$form.fullName = $form.fullName ?? '';

		isProfileModified = $form.username?.trim() !== username || $form.fullName?.trim() !== fullName;
	}

	const { enhance, form, errors, delayed, message } = superForm(data.profileForm, {
		validators: ProfileValidationSchema,

		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			notificationFunction(alertText, { target: 'dashboardLayout' });
		}
	});
</script>

<PageSubHeader heading="Profile" subheading="Your profile information" />

<form use:enhance method="POST" aria-label="Profile form" class="grid gap-10">
	<input type="hidden" name="id" value={$form.id} />

	<fieldset>
		<InputField
			type="text"
			name="username"
			label="Username"
			enterkeyhint="send"
			placeholder="Enter username"
			bind:value={$form.username}
			errorMessage={$errors.username}
			maxlength={MAX_USERNAME_LENGTH}
		/>

		<p class="mt-2 text-sm text-muted-foreground">
			Your public username. If left blank, you'll appear as 'Anonymous'. Note that changing your
			username frees up the previous one for others to use.
		</p>
	</fieldset>

	<fieldset>
		<InputField
			type="text"
			name="fullName"
			label="Full Name"
			enterkeyhint="send"
			placeholder="Enter full name"
			bind:value={$form.fullName}
			errorMessage={$errors.fullName}
			maxlength={MAX_FULL_NAME_LENGTH}
		/>

		<p class="mt-2 text-sm text-muted-foreground">
			This is the name that will be displayed on your profile.
		</p>
	</fieldset>

	<SubmitButton showSpinner={$delayed} disabled={$delayed || !isProfileModified}>
		{$delayed ? 'Saving...' : 'Save'}
	</SubmitButton>
</form>
