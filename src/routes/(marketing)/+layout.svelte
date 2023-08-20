<script>
	import Logo from '$globalComponents/MainHeader/Logo.svelte';
	import MainHeader from '$globalComponents/MainHeader/MainHeader.svelte';
	import SitePageLinks from '$marketingComponents/SiteHeader/sitePageLinks.svelte';
</script>

<MainHeader>
	<Logo href="/" linkTitle="Go to homepage" slot="logo" />

	<SitePageLinks slot="nav" />
</MainHeader>

<main class="mt-10">
	<slot />
</main>
