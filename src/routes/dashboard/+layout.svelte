<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import Logo from '$globalComponents/MainHeader/Logo.svelte';
	import MainHeader from '$globalComponents/MainHeader/MainHeader.svelte';
	import DashboardPageLinks from '$dashboardComponents/DashboardHeader/DashboardPageLinks.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="h-[100dvh] flex flex-col pb-6">
	<MainHeader>
		<Logo href="dashboard/prompts" linkTitle="Go to prompts page" slot="logo" />

		<DashboardPageLinks slot="nav" />
	</MainHeader>

	<main class="relative grid w-full max-w-xl mx-auto mt-8 overflow-hidden pe-4 ps-4">
		<slot />
	</main>
</div>

<SvelteToast options={{ intro: { y: -100 } }} />
