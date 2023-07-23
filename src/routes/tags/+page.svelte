<script lang="ts">
    import type { PageData } from './$types';

    import type { TagSchema } from '$types';

    import { tagSortOptions } from '$data/SortOptions';
    import tagsStore from '$stores/tagStore';

    import SearchBar from '$components/Filters/SearchBar.svelte';
    import SortSelector from '$components/Filters/SortSelector.svelte';
    import TagCreationForm from '$components/Forms/TagCreationForm.svelte';
    import TagEditForm from '$components/Forms/TagEditForm.svelte';
    import TagList from '$components/Tags/TagList.svelte';

    export let data: PageData;

    let tagCreationModalRef: HTMLDialogElement;
    let tagEditModalRef: HTMLDialogElement;

    let selectedTagForEdit: TagSchema;

    /**
     * Handles the tag selection event and opens the tag edit modal
     * @param {CustomEvent} event - The custom event triggered on tag selection
     */
    const handleTagSelection = (event: CustomEvent) => {
        selectedTagForEdit = event.detail;
        tagEditModalRef.showModal();
    };
</script>

<svelte:head>
    <title>Tag Management</title>
    <meta
        name="description"
        content="Manage your tags with ease using our tag management system."
    />
</svelte:head>

<h1 class="text-xl text-center mb-7">Tag Management</h1>

<nav class="flex flex-col gap-3 mb-8 sm:flex-row">
    <SearchBar searchTargetType="tag" />
    <SortSelector store={tagsStore} sortOptions={tagSortOptions} />
</nav>

<TagList
    on:addItem={() => tagCreationModalRef.showModal()}
    on:editTag={handleTagSelection}
/>

<TagCreationForm bind:tagCreationModalRef tagCreationFormData={data.form} />

<TagEditForm
    bind:tagEditModalRef
    tagEditFormData={data.form}
    {selectedTagForEdit}
/>
