<script>
	import Logo from '$globalComponents/mainHeader/Logo.svelte';
	import MainHeader from '$globalComponents/mainHeader/MainHeader.svelte';
	import MarketingHeaderLinks from '$marketingComponents/marketingHeader/MarketingHeaderLinks.svelte';
</script>

<div class="h-[100dvh] flex flex-col">
	<MainHeader>
		<Logo href="/" linkTitle="Go to homepage" slot="logo" />

		<MarketingHeaderLinks slot="nav" />
	</MainHeader>

	<main class="flex-1">
		<div class="container grid items-center h-full">
			<slot />
		</div>
	</main>

	<footer>
		<div class="container py-2">
			<p class="text-muted-foreground">&copy; Promptly</p>
		</div>
	</footer>
</div>
