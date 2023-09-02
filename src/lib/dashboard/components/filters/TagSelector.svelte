<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { TagSchema } from '$databaseDir/schema';

	import { onOutsideClick } from '$dashboardUtils/functions';

	import { tagsFilter } from '$dashboardStores/promptsStore';
	import { allTagsStore } from '$dashboardStores/tagsStore';

	import SelectedTag from './SelectedTag.svelte';
	import Tag from './Tag.svelte';

	// Determines whether prompts should be filtered based on selected tags
	export let filterPromptBasedOnTags: boolean = false;

	// A writable store that keeps track of the IDs of selected tags
	export let selectedTagIds: Writable<string[]>;

	let tagSearchInput: HTMLInputElement;

	let tagSearchQuery: string = '';
	let activeTagIndex: number = 0;
	let isTagSelectionMenuOpen: boolean = false;

	// Filter tags based on the tagSearchQuery value and exclude already selected tags
	$: filteredTags = $allTagsStore.filter(
		(tag) =>
			!$selectedTagIds.includes(tag.id) &&
			tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
	);

	// Update selectedTags when selectedTagIds change
	$: selectedTags = $allTagsStore.filter((tag) => $selectedTagIds.includes(tag.id));

	/**
	 * Adds a tag to the selected tags
	 *
	 * @param {TagSchema} tag - The tag to add
	 */
	function addTag(tag: TagSchema) {
		selectedTagIds.update((ids) => [...ids, tag.id]);

		tagSearchQuery = '';
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
</script>

<form
	use:onOutsideClick={() => (isTagSelectionMenuOpen = false)}
	class="relative grid gap-3 p-2 border rounded-md bg-background"
	aria-label="Tag selection form"
>
	{#if selectedTags.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each selectedTags as tag (tag.id)}
				<SelectedTag {tag} on:removeTag={() => removeTag(tag)} />
			{/each}
		</div>
	{/if}

	<label>
		<span class="sr-only">Select tags</span>
		<input
			bind:value={tagSearchQuery}
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
			placeholder="Select tags"
			aria-activedescendant={`tag-${activeTagIndex}`}
			class="w-full px-3 py-2 text-sm bg-transparent border rounded-md border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		/>
	</label>

	{#if isTagSelectionMenuOpen && filteredTags.length > 0}
		<fieldset
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
</form>
