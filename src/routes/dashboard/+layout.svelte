<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import type { LayoutData } from './$types';

	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import DashboardHeader from '$dashboardComponents/dashboardHeader/DashboardHeader.svelte';
	import FeedbackForm from '$dashboardComponents/forms/FeedbackForm.svelte';

	export let data: LayoutData;

	let { session, userProfile } = data;
	$: ({ session, userProfile } = data);

	$: session?.user && userProfile ? userProfileStore.set(userProfile) : userProfileStore.set(null);
</script>

<div class="h-[100dvh] flex flex-col pb-6">
	<DashboardHeader />

	<main class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4">
		<slot />
	</main>
</div>

<FeedbackForm />

<SvelteToast options={{ intro: { y: -100 } }} />
