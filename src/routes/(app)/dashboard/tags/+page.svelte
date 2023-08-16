<script lang="ts">
    import type { PageData } from './$types';

    import type { TagSchema } from '$dashboardTypes/dashboardTypes';

    import { tagSortOptions } from '$dashboardData/SortOptions';

    import SearchBar from '$dashboardComponents/Filters/SearchBar.svelte';
    import SortSelector from '$dashboardComponents/Filters/SortSelector.svelte';
    import TagCreationForm from '$dashboardComponents/Forms/TagCreationForm.svelte';
    import TagEditForm from '$dashboardComponents/Forms/TagEditForm.svelte';
    import TagList from '$dashboardComponents/Tags/TagList.svelte';

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

<nav class="flex flex-col gap-3 mb-5 sm:flex-row">
    <SearchBar searchTargetType="tag" />
    <SortSelector itemType="tag" sortOptions={tagSortOptions} />
</nav>

<TagList
    on:addItem={() => tagCreationModalRef.showModal()}
    on:editTag={handleTagSelection}
/>

<TagCreationForm bind:tagCreationModalRef tagCreationFormData={data.tagForm} />

<TagEditForm
    bind:tagEditModalRef
    tagEditFormData={data.tagForm}
    {selectedTagForEdit}
/>
