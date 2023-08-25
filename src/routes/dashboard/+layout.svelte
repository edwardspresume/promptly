<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { RoutePaths } from '$globalTypes';
	import type { LayoutData } from './$types';

	import DashboardHeaderLinks from '$dashboardComponents/dashboardHeader/DashboardHeaderLinks.svelte';
	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MainHeader from '$globalComponents/mainHeader/MainHeader.svelte';

	export let data: LayoutData;
</script>

<div class="h-[100dvh] flex flex-col pb-6">
	<MainHeader>
		<Logo href={RoutePaths.DASHBOARD_PROMPTS} linkTitle="Go to prompts page" slot="logo" />

		<DashboardHeaderLinks slot="nav" />
	</MainHeader>

	<main class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4">
		<slot />
	</main>
</div>

<SvelteToast options={{ intro: { y: -100 } }} />
