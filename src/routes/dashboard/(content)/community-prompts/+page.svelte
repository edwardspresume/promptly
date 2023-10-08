<script lang="ts">
	import type { PageData } from './$types';

	import type { ShareablePromptSchema } from '$databaseDir/schema';

	import { communityPromptsStore } from '$dashboardStores/communityPromptsStore';

	import FilterDisplayButton from '$dashboardComponents/filters/FilterDisplayButton.svelte';
	import SearchBar from '$dashboardComponents/filters/SearchBar.svelte';
	import SharedPromptForm from '$dashboardComponents/forms/SharedPromptForm.svelte';
	import BaseModal from '$dashboardComponents/modals/BaseModal.svelte';
	import PromptsFiltersModal from '$dashboardComponents/modals/PromptsFiltersModal.svelte';
	import CommunityPromptList from '$dashboardComponents/prompts/CommunityPromptList.svelte';
	import MetaTags from '$globalComponents/MetaTags.svelte';

	export let data: PageData;

	const { communityPrompts, communityPromptForm, uniqueCommunityTags } = data;

	communityPromptsStore.set(communityPrompts);

	let promptsFiltersModalRef: HTMLDialogElement;
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

<MetaTags
	title="Community Prompts Dashboard | Promptly: Discover and Save Creative Inspirations"
	description="Venture into Promptly's community prompts dashboard to explore a diverse collection of prompts shared by others. Find inspirations and easily save prompts that spark your interest for future use."
/>

<h1 class="text-xl text-center mb-7">Community Prompts</h1>

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
	<SearchBar searchTargetType="communityPrompt" />
	<FilterDisplayButton on:showFilters={() => promptsFiltersModalRef.showModal()} />
</nav>

<CommunityPromptList on:viewPrompt={handlePromptSelection} />

<PromptsFiltersModal bind:promptsFiltersModalRef sharedTags={uniqueCommunityTags} />

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
