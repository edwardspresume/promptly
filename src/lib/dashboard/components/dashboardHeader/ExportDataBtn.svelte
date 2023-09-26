<script lang="ts">
	import { userPromptsStore } from '$dashboardStores/userPromptsStore';
	import { userTagsStore } from '$dashboardStores/userTagsStore';
	import { exportUserData } from '$dashboardUtils/exportUserData';

	import Icon from '$globalComponents/Icon.svelte';

	const userData = {
		prompts: $userPromptsStore,
		tags: $userTagsStore
	};
</script>

<button
	type="button"
	on:click={() => exportUserData(userData)}
	title="Export prompts and tags data"
	aria-label="Export prompts and tags data"
>
	<Icon name="download" />
	<span>Export Data</span>
</button>
