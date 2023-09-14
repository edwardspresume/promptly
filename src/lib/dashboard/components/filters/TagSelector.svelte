<script lang="ts">
	import type { TagSchema } from '$databaseDir/schema';

	import { onOutsideClick } from '$dashboardUtils/functions';

	import { tagsFilter } from '$dashboardStores/promptsStore';
	import { allTagsStore } from '$dashboardStores/tagsStore';

	import Label from '$globalComponents/ui/label/label.svelte';
	import SelectedTag from './SelectedTag.svelte';
	import Tag from './Tag.svelte';

	// Determines whether prompts should be filtered based on selected tags
	export let filterPromptBasedOnTags: boolean = false;

	// Label for the tag selector
	export let label: string = 'Tag';

	// An array that contains the tags shared by another user's prompt
	export let sharedTags: TagSchema[] = [];

	// An array that contains the IDs of the selected tags
	export let selectedTagIds: string[] | null = [];

	let allTags: TagSchema[] = [];
	let tagSearchTerm: string = '';
	let activeTagIndex: number = 0;
	let tagSearchInput: HTMLInputElement;
	let isTagSelectionMenuOpen: boolean = false;

	// Determines whether to use shared tags or all tags based on the sharedTags length
	let isSharedTag: boolean = sharedTags.length > 0;

	// Selects the appropriate tags source based on the sharedTags length
	$: allTags = sharedTags.length > 0 ? sharedTags : $allTagsStore;

	// Filter tags based on the tagSearchTerm value and exclude already selected tags
	$: filteredTags = allTags.filter((tag) => {
		const lowerCaseQuery = tagSearchTerm.toLowerCase();
		return !selectedTagIds?.includes(tag.id) && tag.name.toLowerCase().includes(lowerCaseQuery);
	});

	// Updates the selected tags based on the selected tag IDs
	$: selectedTags = allTags.filter((tag) => selectedTagIds?.includes(tag.id));

	/**
	 * Adds a tag to the selected tags
	 *
	 * @param {TagSchema} tag - The tag to add
	 */
	function addTag(tag: TagSchema) {
		if (selectedTagIds) {
			selectedTagIds = [...selectedTagIds, tag.id];
		}

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
		if (selectedTagIds) {
			selectedTagIds = selectedTagIds.filter((id) => id !== tag.id);
		}
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

	let tagLabel = `${label}${allTags.length > 1 ? 's' : ''}`;

	// Creates a label indicating the number of selected tags and the total number of available tags
	$: tagCountLabel = `${selectedTags.length}/${allTags.length}`;

	// Sets the tag filter in the prompts store when filterPromptBasedOnTags is true
	$: if (filterPromptBasedOnTags && selectedTagIds) tagsFilter.set(selectedTagIds);
</script>

<fieldset use:onOutsideClick={() => (isTagSelectionMenuOpen = false)} class="grid gap-1">
	<Label for="tagInput">
		<span>{tagLabel}</span>

		<span class="text-xs text-muted-foreground"> {tagCountLabel} </span>
	</Label>

	<div class="grid gap-3">
		{#if selectedTags.length > 0}
			<div class="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
				{#each selectedTags as tag (tag.id)}
					<SelectedTag {tag} {isSharedTag} on:removeTag={() => removeTag(tag)} />
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
