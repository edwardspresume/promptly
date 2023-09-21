<script lang="ts">
	import type { LayoutData } from './$types';

	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { userPromptsStore } from '$dashboardStores/userPromptsStore';
	import { userTagsStore } from '$dashboardStores/userTagsStore';
	import {
		promptLocalStorageManager,
		tagLocalStorageManager
	} from '$dashboardUtils/localStorageManager';

	import DashboardHeader from '$dashboardComponents/dashboardHeader/DashboardHeader.svelte';
	import FeedbackForm from '$dashboardComponents/forms/FeedbackForm.svelte';

	export let data: LayoutData;

	// Initialize the data
	let { session, userProfile, userTags, feedbackForm } = data;

	// Update the data if it changes
	$: ({ session, userProfile, userTags, feedbackForm } = data);

	// Initialize or update user and store data based on the session.

	$: if (!session?.user) {
		userProfileStore.set(null);
		userPromptsStore.set(promptLocalStorageManager.getItems());
		userTagsStore.set(tagLocalStorageManager.getItems());
	} else {
		userProfileStore.set(userProfile ?? null);
		userTagsStore.set(userTags ?? []);
	}
</script>

<div class="h-[100dvh] flex flex-col">
	<DashboardHeader />

	<slot />
</div>

<FeedbackForm feedbackFormData={feedbackForm} />

<SvelteToast target="dashboardLayout" options={{ intro: { y: -100 } }} />
