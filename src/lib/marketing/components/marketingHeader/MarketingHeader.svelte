<script>
	import { RoutePaths } from '$globalTypes';

	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MainNav from '$globalComponents/mainHeader/MainNav.svelte';
	import MarketingHeaderLinks from './MarketingHeaderLinks.svelte';
</script>

<header class="py-2 border-b">
	<div class="container flex justify-between">
		<Logo href={RoutePaths.MARKETING_LANDING} linkTitle="Go to homepage" />

		<MainNav>
			<MarketingHeaderLinks />
		</MainNav>
	</div>
</header>
