<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import type { ConfirmationInfo } from '$dashboardTypes';
	import type { TagSchema } from '$databaseDir/schema';

	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';

	import DeleteItemBtn from '$dashboardComponents/list/DeleteItemBtn.svelte';
	import ListItem from '$dashboardComponents/list/ListItem.svelte';

	export let tag: TagSchema;

	$: tagName = tag.name;
	$: tagId = tag.id;

	const dispatch = createEventDispatcher();

	/**
	 * Deletes the tag either from the database or from the local storage,
	 * depending on whether the user is logged in.
	 * @async
	 * @returns {ReturnType<ConfirmationInfo['callback']>} - The alert type and text of the delete operation.
	 */
	async function deleteTagCallBack(): ReturnType<ConfirmationInfo['callback']> {
		try {
			if ($page.data.session !== null) {
				const { error } = await $page.data.supabase.from('tags').delete().eq('id', tagId);

				if (error) throw new Error(`Supabase error`);
			} else {
				tagLocalStorageManager.deleteItem(tagId);
			}

			return { alertType: 'success', alertText: 'Tag deleted successfully!' };
		} catch (e) {
			console.error('Failed to delete tag');
            
			return { alertType: 'error', alertText: 'Failed to delete tag. Please try again later' };
		}
	}

	/**
	 * Dispatches a delete tag event with the necessary confirmation info.
	 */
	function dispatchDeleteTagEvent() {
		const confirmationInfo: ConfirmationInfo = {
			heading: `Delete Tag`,
			subheading: `Are you sure you want to permanently delete tag: <em style="color: red;">${tagName}</em>? This action cannot be undone.`,
			callback: deleteTagCallBack
		};

		dispatch('deleteTag', confirmationInfo);
	}
</script>

<ListItem title={`Edit tag: ${tagName}`} onItemClickOrKeyPress={() => dispatch('editTag', tag)}>
	<h2 class="font-normal select-none">{tagName}</h2>

	<DeleteItemBtn
		buttonTitle={`Delete tag: ${tagName}`}
		on:click={dispatchDeleteTagEvent}
		class="p-1 h-fit"
	/>
</ListItem>
