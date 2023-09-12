<script lang="ts">
	import { writable, type Writable } from 'svelte/store';

	import type { TagSchema } from '$databaseDir/schema';

	import { onOutsideClick } from '$dashboardUtils/functions';

	import { tagsFilter } from '$dashboardStores/promptsStore';
	import { allTagsStore } from '$dashboardStores/tagsStore';

	import Label from '$globalComponents/ui/label/label.svelte';
	import { fade } from 'svelte/transition';
	import SelectedTag from './SelectedTag.svelte';
	import Tag from './Tag.svelte';

	// Determines whether prompts should be filtered based on selected tags
	export let filterPromptBasedOnTags: boolean = false;

	// A writable store that keeps track of the IDs of selected tags
	export let label: string = 'Tag';
	export let selectedTagIds: Writable<string[]> = writable([]);
	export let labelIsScreenReaderOnly: boolean = false;

	let tagSearchInput: HTMLInputElement;

	let tagSearchTerm: string = '';
	let activeTagIndex: number = 0;
	let isTagSelectionMenuOpen: boolean = false;

	// Filter tags based on the tagSearchTerm value and exclude already selected tags
	$: filteredTags = $allTagsStore.filter((tag) => {
		const lowerCaseQuery = tagSearchTerm.toLowerCase();
		return !$selectedTagIds.includes(tag.id) && tag.name.toLowerCase().includes(lowerCaseQuery);
	});

	// Update selectedTags when selectedTagIds change
	$: selectedTags = $allTagsStore.filter((tag) => $selectedTagIds.includes(tag.id));

	/**
	 * Adds a tag to the selected tags
	 *
	 * @param {TagSchema} tag - The tag to add
	 */
	function addTag(tag: TagSchema) {
		selectedTagIds.update((ids) => [...ids, tag.id]);

		tagSearchTerm = '';
		activeTagIndex = 0;

		tagSearchInput.focus();
	}

	/**
	 * Removes a tag from the selected tags
	 *
	 * @param {TagSchema} tag - The tag to remove
	 */
	function removeTag(tag: TagSchema) {
		selectedTagIds.update((ids) => ids.filter((id) => id !== tag.id));
	}

	/**
	 * Handles keyboard navigation within the tag selection menu
	 *
	 * @param {KeyboardEvent} event - The event triggered by a keyboard key press
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && activeTagIndex < filteredTags.length - 1) {
			event.preventDefault();
			activeTagIndex++;
		} else if (event.key === 'ArrowUp' && activeTagIndex > 0) {
			event.preventDefault();
			activeTagIndex--;
		} else if (
			event.key === 'Enter' &&
			activeTagIndex >= 0 &&
			activeTagIndex < filteredTags.length
		) {
			event.preventDefault();

			const tag = filteredTags[activeTagIndex];

			if (tag) addTag(tag);
		}
	}

	// Sets tag filter in prompts store when filterPromptBasedOnTags is true
	$: if (filterPromptBasedOnTags) tagsFilter.set($selectedTagIds);

	let tagLabel = `${label}${$allTagsStore.length > 1 ? 's' : ''}`;

	$: tagCountLabel = `${selectedTags.length}/${$allTagsStore.length}`;
</script>

<fieldset use:onOutsideClick={() => (isTagSelectionMenuOpen = false)} class="grid gap-1">
	<Label for="tagInput" class={labelIsScreenReaderOnly ? 'sr-only' : ''}>
		<span>{tagLabel}</span>

		<span class="text-xs text-muted-foreground"> {tagCountLabel} </span>
	</Label>

	<div class="grid gap-3">
		{#if selectedTags.length > 0}
			<div transition:fade class="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
				{#each selectedTags as tag (tag.id)}
					<SelectedTag {tag} on:removeTag={() => removeTag(tag)} />
				{/each}
			</div>
		{/if}

		<input
			id="tagInput"
			bind:value={tagSearchTerm}
			bind:this={tagSearchInput}
			on:keydown={handleKeyDown}
			on:focus={() => (isTagSelectionMenuOpen = true)}
			on:input={() => (activeTagIndex = 0)}
			type="search"
			role="combobox"
			autocorrect="off"
			autocomplete="off"
			spellcheck="false"
			aria-expanded={isTagSelectionMenuOpen}
			aria-autocomplete="list"
			aria-controls="tags-list"
			placeholder="Select tag"
			aria-activedescendant={`tag-${activeTagIndex}`}
		/>

		{#if isTagSelectionMenuOpen && filteredTags.length > 0}
			<fieldset
				transition:fade
				id="tags-list"
				aria-label="Tags list"
				class="gap-3 p-2 overflow-y-auto border rounded-md max-h-32 sm:max-h-52"
			>
				{#each filteredTags as tag, index (tag.id)}
					<Tag
						{tag}
						{index}
						isActive={index === activeTagIndex}
						on:addTag={() => addTag(tag)}
						on:focus={() => (activeTagIndex = index)}
						on:hover={() => (activeTagIndex = index)}
					/>
				{/each}
			</fieldset>
		{/if}
	</div>
</fieldset>
