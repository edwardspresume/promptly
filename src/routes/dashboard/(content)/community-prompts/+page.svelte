<script lang="ts">
	import type { PageData } from './$types';

	import type { ShareablePromptSchema } from '$databaseDir/schema';

	import { communityPromptsStore } from '$dashboardStores/communityPromptsStore';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SharedPromptForm from '$dashboardComponents/forms/SharedPromptForm.svelte';
	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import CommunityPromptList from '$dashboardComponents/prompts/CommunityPromptList.svelte';

	export let data: PageData;

	const { communityPrompts, communityPromptForm } = data;

	communityPromptsStore.set(communityPrompts);

	let communityPromptViewModalRef: HTMLDialogElement;
	let selectedPrompt: ShareablePromptSchema;
	let selectPromptCreatorInfo: string = '';

	/**
	 * Handles selection of a prompt, preparing it for editing.
	 * @param {CustomEvent} event - The event carrying details of the selected prompt.
	 */
	const handlePromptSelection = (event: CustomEvent) => {
		if (!event.detail) throw new Error('No prompt selected');

		selectedPrompt = event.detail;

		const { username, avatarUrl } = selectedPrompt.profile;

		selectPromptCreatorInfo = `<span>Creator: ${username ?? 'Anonymous'}</span>
		${
			avatarUrl
				? `<img src="${avatarUrl}" alt="Prompt creator avatar" class="rounded-full w-7 h-7" />`
				: ''
		}`;

		communityPromptViewModalRef.showModal();
	};
</script>

<svelte:head>
	<title>Community Prompts</title>
	<meta
		name="description"
		content="Community prompts are prompts that are made public by the community."
	/>
</svelte:head>

<h1 class="text-xl text-center mb-7">Community Prompts</h1>

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="communityPrompt" />
	<FilterDisplayButton />
</nav>

<CommunityPromptList on:viewPrompt={handlePromptSelection} />

<BaseModal
	modalTitle="Shared Prompt"
	modalDescription={selectPromptCreatorInfo}
	bind:dialogElement={communityPromptViewModalRef}
>
	<SharedPromptForm
		sharedPrompt={selectedPrompt}
		sharedPromptForm={communityPromptForm}
		toastNotificationTarget="baseModal"
	/>
</BaseModal>
