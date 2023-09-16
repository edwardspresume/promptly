<script lang="ts">
	import type { LayoutData } from './$types';

	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import DashboardHeader from '$dashboardComponents/dashboardHeader/DashboardHeader.svelte';
	import FeedbackForm from '$dashboardComponents/forms/FeedbackForm.svelte';

	export let data: LayoutData;

	// Initialize the data
	let { session, userProfile, feedbackForm } = data;

	// Update the data if it changes
	$: ({ session, userProfile, feedbackForm } = data);

	// Initialize or update user and store data based on the session.
	$: if (session?.user) {
		userProfileStore.set(userProfile ?? null);
	} else {
		userProfileStore.set(null);
	}
</script>

<div class="h-[100dvh] flex flex-col">
	<DashboardHeader />

	<slot />
</div>

<FeedbackForm feedbackFormData={feedbackForm} />

<SvelteToast target="dashboardLayout" options={{ intro: { y: -100 } }} />
