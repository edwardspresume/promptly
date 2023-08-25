<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import DashboardHeaderLinks from './DashboardHeaderLinks.svelte';
</script>

<header class="z-50 py-1 border-b">
	<div class="container flex items-center justify-between px-1">
		<Logo href={RoutePaths.DASHBOARD_PROMPTS} linkTitle="Go to prompts page" />

		<nav>
			<DashboardHeaderLinks />
		</nav>
	</div>
</header>
