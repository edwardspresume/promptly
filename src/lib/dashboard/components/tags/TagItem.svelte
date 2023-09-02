<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	import type { ConfirmationInfo } from '$dashboardTypes';
	import type { TagSchema } from '$databaseDir/schema';
	import type { StatusType } from '$globalTypes';

	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';

	import DeleteItemBtn from '$dashboardComponents/list/DeleteItemBtn.svelte';
	import ListItem from '$dashboardComponents/list/ListItem.svelte';

	export let tag: TagSchema;

	$: tagName = tag.name;
	$: tagId = tag.id;

	const dispatch = createEventDispatcher();

	/**
	 * Callback function to delete the tag.
	 * It either deletes the tag from the database or from the local storage depending on the user's is logged in.
	 * @async
	 * @returns {Promise<{statusType: StatusType}>} - The status of the operation.
	 */
	async function deleteTagCallBack(): Promise<{ statusType: StatusType }> {
		try {
			if ($page.data.session !== null) {
				const { error } = await $page.data.supabase.from('tags').delete().eq('id', tagId);
				if (error) throw new Error(`Supabase error: ${error.message}`);
			} else {
				tagLocalStorageManager.deleteItem(tagId);
			}

			return { statusType: 'success' };
		} catch (e) {
			console.error('Failed to delete tag');
			return { statusType: 'error' };
		}
	}

	/**
	 * Dispatches a delete tag event with the necessary confirmation info.
	 */
	function dispatchDeleteTagEvent() {
		const confirmationInfo: ConfirmationInfo = {
			heading: `Delete Tag`,
			subheading: `Are you sure you want to delete tag: <em style="color: red;">${tagName}</em> ?`,
			toastMessage: 'Tag deleted successfully!',
			callback: deleteTagCallBack
		};

		dispatch('deleteTag', confirmationInfo);
	}
</script>

<ListItem title={`Edit tag: ${tagName}`} onItemClickOrKeyPress={() => dispatch('editTag', tag)}>
	<h2 class="font-normal select-none">{tagName}</h2>

	<DeleteItemBtn buttonTitle={`Delete tag: ${tagName}`} on:click={dispatchDeleteTagEvent} />
</ListItem>
