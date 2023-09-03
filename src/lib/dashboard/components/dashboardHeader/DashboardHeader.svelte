<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import AccountDropdownMenu from './AccountPopUpMenu.svelte';
	import DashboardHeaderLinks from './DashboardHeaderLinks.svelte';
</script>

<header class="z-50 py-2 border-b">
	<div class="container flex items-center justify-between max-w-5xl">
		<nav class="flex items-center gap-2">
			<Logo href={RoutePaths.DASHBOARD_PROMPTS} linkTitle="Go to prompts page" />

			<DashboardHeaderLinks />
		</nav>

		<aside class="flex items-center gap-2">
			<ThemeToggleBtn />

			<AccountDropdownMenu />
		</aside>
	</div>
</header>
