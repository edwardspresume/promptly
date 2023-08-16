<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import type { ConfirmationInfo, TagSchema } from '$dashboardTypes/dashboardTypes';

    import { userSessionStore } from '$globalStores/userAndSupabaseStores';

    import { deleteItemFromDatabaseRequest } from '$dashboardUtils/databaseUtils';
    import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';

    import DeleteItemBtn from '$dashboardComponents/General/DeleteItemBtn.svelte';
    import ListItem from '$dashboardComponents/General/ListItem.svelte';

    export let tag: TagSchema;

    // Reactive statements to keep tagId and tagName up to date
    $: tagName = tag.name;
    $: tagId = tag.id;

    const dispatch = createEventDispatcher();

    /**
     * Callback function to delete the tag.
     * It either sends an HTTP request or deletes it from local storage.
     */
    async function deleteTagCallBack() {
        if ($userSessionStore) {
            await deleteItemFromDatabaseRequest('?/deleteTag', tagId);
        } else {
            tagLocalStorageManager.deleteItem(tagId!);
        }
    }

    /**
     * Dispatches a delete tag event with the necessary confirmation info.
     */
    function dispatchDeleteTagEvent() {
        const confirmationInfo: ConfirmationInfo = {
            title: `Are you sure you want to delete tag: <em style="color: red;">${tagName}</em> ?`,
            toastMessage: 'Tag deleted successfully',
            callback: deleteTagCallBack,
        };

        dispatch('deleteTag', confirmationInfo);
    }
</script>

<ListItem
    title={`Edit tag: ${tagName}`}
    onItemClickOrKeyPress={() => dispatch('editTag', tag)}
>
    <h3 class="select-none">{tagName}</h3>

    <DeleteItemBtn
        on:click={dispatchDeleteTagEvent}
        buttonTitle={`Delete tag: ${tagName}`}
    />
</ListItem>
