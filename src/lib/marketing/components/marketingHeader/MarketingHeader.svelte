<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MarketingHeaderLinks from './MarketingHeaderLinks.svelte';
</script>

<header class="py-2 border-b">
	<div class="container flex items-center justify-between">
		<Logo href={RoutePaths.MARKETING_LANDING} linkTitle="Go to homepage" />

		<nav>
			<MarketingHeaderLinks />
		</nav>
	</div>
</header>
