<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
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
	import PageLoadingSpinner from '$globalComponents/general/PageLoadingSpinner.svelte';

	export let data: LayoutData;

	// Initialize the data
	let { session, supabase, userProfile, userTags, feedbackForm } = data;

	// Update the data if it changes
	$: ({ session, supabase, userProfile, userTags, feedbackForm } = data);

	// Initialize or update user and store data based on the session.

	$: if (!session?.user) {
		userProfileStore.set(null);
		userPromptsStore.set(promptLocalStorageManager.getItems());
		userTagsStore.set(tagLocalStorageManager.getItems());
	} else {
		userProfileStore.set(userProfile ?? null);
		userTagsStore.set(userTags ?? []);
	}

	onMount(async () => {
		if ($userProfileStore) {
			await supabase
				.channel('profiles_table_DB_changes')
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'profiles_table'
					},
					(payload) => {
						const newSubscription_status = payload.new.subscription_status;

						if (newSubscription_status !== $userProfileStore?.subscriptionStatus) {
							invalidateAll();
						}
					}
				)
				.subscribe();
		}
	});
</script>

<div class="h-[100dvh] flex flex-col">
	<DashboardHeader />

	<PageLoadingSpinner>
		<slot />
	</PageLoadingSpinner>
</div>

<FeedbackForm feedbackFormData={feedbackForm} />

<SvelteToast target="dashboardLayout" options={{ intro: { y: -100 } }} />
