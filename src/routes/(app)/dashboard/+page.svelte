<script lang="ts">
    import type { PageData } from './$types';

    import type { PromptSchema } from '$databaseDir/schema';

    import FilterDisplayButton from '$dashboardComponents/Filters/FilterDisplayButton.svelte';
    import SearchBar from '$dashboardComponents/Filters/SearchBar.svelte';
    import PromptCreationForm from '$dashboardComponents/Forms/PromptCreationForm.svelte';
    import PromptEditForm from '$dashboardComponents/Forms/PromptEditForm.svelte';
    import PromptsFiltersModal from '$dashboardComponents/Modals/PromptsFiltersModal.svelte';
    import PromptList from '$dashboardComponents/Prompts/PromptList.svelte';
    import TabGroup from '$dashboardComponents/Prompts/TabGroup.svelte';

    export let data: PageData;

    // Element references
    let promptsFiltersModalRef: HTMLDialogElement;
    let promptCreationModalRef: HTMLDialogElement;
    let promptEditModalRef: HTMLDialogElement;

    let selectedPromptForEdit: PromptSchema;
    let selectedTabIndex: number = 0;

    /**
     * Handles selection of a prompt, preparing it for editing.
     * @param {CustomEvent} event - The event carrying details of the selected prompt.
     */
    const handlePromptSelection = (event: CustomEvent) => {
        if (!event.detail) throw new Error('No prompt selected');

        selectedPromptForEdit = event.detail;
        promptEditModalRef.showModal();
    };
</script>

<svelte:head>
    <title>Promptly</title>
    <meta name="description" content="Promptly Dashboard" />
</svelte:head>

<TabGroup
    on:tabItemClicked={({ detail }) =>
        (selectedTabIndex = detail.selectedTabIndex)}
/>

<nav
    aria-label="Filter prompts"
    class="flex flex-col gap-3 mt-6 mb-5 overflow-hidden sm:flex-row"
>
    <SearchBar searchTargetType="prompt" />

    <FilterDisplayButton
        on:showFilters={() => promptsFiltersModalRef.showModal()}
    />
</nav>

{#if selectedTabIndex === 0}
    <PromptList
        on:addItem={() => promptCreationModalRef.showModal()}
        on:editPrompt={handlePromptSelection}
    />
{:else if selectedTabIndex === 1}
    <PromptList
        isShowingOnlyFavorites={true}
        on:addItem={() => promptCreationModalRef.showModal()}
        on:editPrompt={handlePromptSelection}
    />
{/if}

<PromptsFiltersModal bind:promptsFiltersModalRef />

<PromptCreationForm
    bind:promptCreationModalRef
    promptCreationFormData={data.promptForm}
/>

<PromptEditForm
    bind:promptEditModalRef
    promptEditFormData={data.promptForm}
    {selectedPromptForEdit}
/>
