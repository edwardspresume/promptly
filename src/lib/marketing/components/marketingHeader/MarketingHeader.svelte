<script>
	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MarketingHeaderLinks from './MarketingHeaderLinks.svelte';
</script>

<header class="py-1 border-b">
	<div class="container flex items-center justify-between px-1">
		<Logo href="/" linkTitle="Go to homepage" />

		<nav>
			<MarketingHeaderLinks />
		</nav>
	</div>
</header>
