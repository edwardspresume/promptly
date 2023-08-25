<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import DashboardHeader from '$dashboardComponents/dashboardHeader/DashboardHeader.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="h-[100dvh] flex flex-col pb-6">
	<DashboardHeader />

	<main class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4">
		<slot />
	</main>
</div>

<SvelteToast options={{ intro: { y: -100 } }} />
