<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MainNav from '$globalComponents/mainHeader/MainNav.svelte';
	import ThemeToggleBtn from '$globalComponents/mainHeader/ThemeToggleBtn.svelte';
	import AccountDropdownMenu from './AccountPopUpMenu.svelte';
	import DashboardHeaderLinks from './DashboardHeaderLinks.svelte';
</script>

<header class="z-50 py-2 border-b">
	<div class="container flex items-center justify-between max-w-6xl">
		<Logo href={RoutePaths.DASHBOARD_PROMPTS} linkTitle="Go to prompts page" />

		<div class="flex gap-2 sm:items-center">
			<DashboardHeaderLinks class="hidden sm:flex" />

			<ThemeToggleBtn />

			<AccountDropdownMenu />

			<MainNav class="sm:hidden">
				<DashboardHeaderLinks class="grid gap-5" />
			</MainNav>
		</div>
	</div>
</header>
