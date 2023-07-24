<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import tagsStore from '$stores/tagStore';
    import type { ConfirmationInfo, TagSchema } from '$types';

    import DeleteItemBtn from '$components/General/DeleteItemBtn.svelte';
    import ListItem from '$components/General/ListItem.svelte';

    export let tag: TagSchema;

    let { id, name: tagName } = tag;

    $: tagName = tag.name;

    const dispatch = createEventDispatcher();

    function dispatchDeleteTagEvent() {
        const confirmationInfo: ConfirmationInfo = {
            title: `Are you sure you want to delete tag: <em style="color: red;">${tagName}</em> ?`,
            toastMessage: 'Tag deleted successfully',
            callback: () => tagsStore.deleteTag(id),
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
