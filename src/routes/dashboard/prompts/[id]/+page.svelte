<script lang="ts">
	import type { PageData } from './$types';

	import { superForm } from 'sveltekit-superforms/client';

	import { RoutePaths } from '$globalTypes';

	import { totalTagsCountStore } from '$dashboardStores/tagsStore';
	import { notifyError } from '$dashboardUtils/toastUtils';

	import {
		MAX_PROMPT_DESCRIPTION_LENGTH,
		MAX_PROMPT_TITLE_LENGTH,
		PromptsValidationSchema
	} from '$dashboardValidationSchemas/promptsValidationSchema';

	import TagSelector from '$dashboardComponents/filters/TagSelector.svelte';
	import FavoriteToggleBtn from '$dashboardComponents/prompts/FavoriteToggleBtn.svelte';
	import InputField from '$globalComponents/form/InputField.svelte';
	import SubmitButton from '$globalComponents/form/SubmitButton.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let data: PageData;

	let { session, promptCreator, sharedTags, sharedPromptForm } = data;

	$: ({ session, promptCreator, sharedTags, sharedPromptForm } = data);

	$: isLoggedIn = session?.user;

	const { enhance, form, errors, delayed, message } = superForm(sharedPromptForm, {
		validators: PromptsValidationSchema,

		onUpdated: () => {
			if (!$message) return;

			notifyError($message.alertText, { target: 'baseModal' });
		}
	});
</script>

<article
	aria-label="Shared Prompt Details"
	class="w-[96%] max-w-xl bg-background border p-6 rounded-lg shadow-sm self-end"
>
	<header>
		<h3 class="text-lg font-semibold leading-none">Shared Prompt</h3>
		<p class="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
			<span>Creator: {promptCreator.username}</span>
			{#if promptCreator.avatarUrl}
				<img
					src={promptCreator.avatarUrl}
					alt="Prompt creator avatar"
					class="rounded-full w-7 h-7"
				/>
			{/if}
		</p>
	</header>

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

		<TagSelector
			bind:sharedTags
			label="Shared tag"
			placeholder="Select a shared tag"
			selectedTagIds={sharedTags.map((tag) => tag.id)}
		/>

		{#if $totalTagsCountStore}
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

			<SubmitButton
				showSpinner={$delayed}
				disabled={$delayed || !isLoggedIn}
				title={$delayed ? 'Saving...' : 'Save Prompt'}
			/>
		</footer>
	</form>
</article>

{#if !isLoggedIn}
	<p class="self-start mt-5 italic font-medium text-accent-foreground">
		<Button variant="link" href={RoutePaths.AUTH} class="p-0">Sign in</Button> to save this prompt to
		your account
	</p>
{/if}
