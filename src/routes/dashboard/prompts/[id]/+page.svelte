<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	import { getNotificationFunction } from '$dashboardUtils/toastUtils';

	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';
	import * as Card from '$globalComponents/ui/card';
	import { RoutePaths } from '$globalTypes';

	export let data: PageData;

	const { sharedPrompt } = data;

	let isSaving = false;

	$: isLoggedIn = data.session?.user;
</script>

<Card.Root role="article" aria-label="Shared Prompt Details" class="w-[96%] max-w-lg bg-background">
	<Card.Header>
		<Card.Title>Shared Prompt</Card.Title>
		<Card.Description>Created by {sharedPrompt.fromUser}</Card.Description>
	</Card.Header>

	<Card.Content class="grid gap-5">
		<InputField type="text" label="Title" value={sharedPrompt.title} readonly />

		<fieldset class="grid gap-1">
			<TextArea rows="9" label="Description" value={sharedPrompt.description} readonly />
		</fieldset>
	</Card.Content>

	<Card.Footer>
		<form
			method="post"
			use:enhance={() => {
				isSaving = true;

				return async ({ update, result }) => {
					await update();
					isSaving = false;

					const { alertText, alertType } = result.data;

					const notificationFunction = getNotificationFunction(alertType);

					notificationFunction(alertText, { target: 'dashboardLayout' });
				};
			}}
		>
			<SubmitButton title="Save Prompt" showSpinner={isSaving} disabled={isSaving || !isLoggedIn} />
		</form>
	</Card.Footer>
</Card.Root>

{#if !isLoggedIn}
	<p class="mt-5 italic font-medium text-accent-foreground">
		<Button variant="link" href={RoutePaths.AUTH} class="p-0">Sign in</Button> to save this prompt to
		your account
	</p>
{/if}
