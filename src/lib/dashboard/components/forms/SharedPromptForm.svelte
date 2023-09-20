<script lang="ts">
	import { page } from '$app/stores';

	import { superForm } from 'sveltekit-superforms/client';

	import type { ShareablePromptSchema, SimplifiedTagSchema } from '$databaseDir/schema';

	import {
		MAX_PROMPT_DESCRIPTION_LENGTH,
		MAX_PROMPT_TITLE_LENGTH,
		PromptsValidationSchema
	} from '$dashboardValidationSchemas/promptsValidationSchema';

	import { userTagsTotalCountStore } from '$dashboardStores/tagsStore';
	import { getNotificationFunction, type ToastTarget } from '$dashboardUtils/toastUtils';

	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import FavoriteToggleBtn from '$dashboardComponents/prompts/FavoriteToggleBtn.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';
	import Icon from '$globalComponents/Icon.svelte';

	export let sharedPromptForm;
	export let sharedPrompt: ShareablePromptSchema;
	export let toastNotificationTarget: ToastTarget;
	export let taintedMessage: string | false | null | undefined = false;

	let sharedTags: SimplifiedTagSchema[] = [];

	$: if (sharedPrompt) {
		$form.title = sharedPrompt.title;
		$form.description = sharedPrompt.description;

		sharedTags = sharedPrompt.tagPromptLink.map((tagPromptLink) => tagPromptLink.tag);
	}

	$: isLoggedIn = $page.data.session?.user;

	const { enhance, form, errors, delayed, message } = superForm(sharedPromptForm, {
		validators: PromptsValidationSchema,
		taintedMessage: taintedMessage,

		onUpdated: () => {
			if (!$message) return;

			const { alertType, alertText } = $message;

			const notificationFunction = getNotificationFunction(alertType);

			notificationFunction(alertText, { target: toastNotificationTarget });
		}
	});
</script>

<form use:enhance method="POST" aria-label="Save shared prompt" class="grid gap-5 mt-6">
	<InputField
		type="text"
		name="title"
		label="Title"
		placeholder="Enter prompt title"
		bind:value={$form.title}
		errorMessage={$errors.title}
		maxlength={MAX_PROMPT_TITLE_LENGTH}
	/>

	<fieldset class="grid gap-1">
		<TextArea
			rows="8"
			name="description"
			label="Description"
			textAreaId="promptDescription"
			placeholder="Enter prompt description"
			bind:value={$form.description}
			errorMessage={$errors.description}
			maxlength={MAX_PROMPT_DESCRIPTION_LENGTH}
		/>
	</fieldset>

	{#if sharedTags.length > 0}
		<TagSelector
			bind:sharedTags
			label="Shared tag"
			placeholder="Select a shared tag"
			selectedTagIds={sharedTags.map((tag) => tag.id)}
		/>
	{/if}

	{#if $userTagsTotalCountStore}
		<TagSelector label="My tag" />
	{/if}

	<footer class="flex items-center gap-2">
		<FavoriteToggleBtn
			isFavorited={$form.isFavorited}
			iconSize={26}
			buttonVariant="outline"
			on:favoriteToggled={() => ($form.isFavorited = !$form.isFavorited)}
			class="h-full p-2"
		/>

		<SubmitButton showSpinner={$delayed} disabled={$delayed || !isLoggedIn}>
			{#if !isLoggedIn}
				<Icon name="lock" />
			{/if}

			{$delayed ? 'Saving...' : 'Save Prompt'}
		</SubmitButton>
	</footer>
</form>
