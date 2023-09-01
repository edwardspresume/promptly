<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import type { LayoutData } from './$types';

	import { allPromptsStore } from '$dashboardStores/promptsStore';
	import { allTagsStore } from '$dashboardStores/tagsStore';
	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import {
		promptLocalStorageManager,
		tagLocalStorageManager
	} from '$dashboardUtils/localStorageManager';

	import DashboardHeader from '$dashboardComponents/dashboardHeader/DashboardHeader.svelte';
	import FeedbackForm from '$dashboardComponents/forms/FeedbackForm.svelte';

	export let data: LayoutData;

	// Update the data if it changes
	$: ({ session, userProfile, userPrompts, userTags, feedbackForm } = data);

	// Initialize or update user and store data based on the session.
	$: if (session?.user) {
		userProfileStore.set(userProfile ?? null);
		allPromptsStore.set(userPrompts ?? []);
		allTagsStore.set(userTags ?? []);
	} else {
		userProfileStore.set(null);
		allPromptsStore.set(promptLocalStorageManager.getItems());
		allTagsStore.set(tagLocalStorageManager.getItems());
	}
</script>

<div class="h-[100dvh] flex flex-col pb-6">
	<DashboardHeader />

	<main class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4">
		<slot />
	</main>
</div>

<FeedbackForm feedbackFormData={feedbackForm} />

<SvelteToast target="dashboardLayout" options={{ intro: { y: -100 } }} />
