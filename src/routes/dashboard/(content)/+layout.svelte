<script lang="ts">
	import type { LayoutData } from './$types';

	import { allTagsStore } from '$dashboardStores/tagsStore';
	import { tagLocalStorageManager } from '$dashboardUtils/localStorageManager';

	export let data: LayoutData;

	let { session, userTags } = data;
	$: ({ session, userTags } = data);

	$: if (session?.user) {
		allTagsStore.set(userTags ?? []);
	} else {
		allTagsStore.set(tagLocalStorageManager.getItems());
	}
</script>

<main class="relative grid w-full max-w-xl pb-6 mx-auto mt-8 overflow-hidden pe-4 ps-4">
	<slot />
</main>
