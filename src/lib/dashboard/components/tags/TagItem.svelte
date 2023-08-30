<script lang="ts">
	import DeleteItemBtn from '$dashboardComponents/list/DeleteItemBtn.svelte';
	import ListItem from '$dashboardComponents/list/ListItem.svelte';

	import type { TagSchema } from '$databaseDir/schema';

	export let tag: TagSchema;

	$: tagName = tag.name;
	$: tagId = tag.id;
</script>

<ListItem title={`Edit tag: ${tagName}`} on:click on:keydown>
	<h2 class="font-normal select-none">{tagName}</h2>

	<DeleteItemBtn buttonTitle={`Delete tag: ${tagName}`} />
</ListItem>
