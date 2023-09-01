<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import AccountDropdownMenu from './AccountPopUpMenu.svelte';
	import DashboardHeaderLinks from './DashboardHeaderLinks.svelte';
</script>

<header class="z-50 py-2 border-b">
	<div class="container flex items-center justify-between max-w-5xl">
		<Logo href={RoutePaths.DASHBOARD_PROMPTS} linkTitle="Go to prompts page" />

		<nav class="flex items-center gap-2">
			<DashboardHeaderLinks />

			<AccountDropdownMenu />
		</nav>
	</div>
</header>
