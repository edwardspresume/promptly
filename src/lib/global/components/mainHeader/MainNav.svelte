<script>
	import MainNavMenuToggleBtn from './MainNavMenuToggleBtn.svelte';

	let isMainNavMenuOpen = false;
</script>

<nav
	class="absolute top-0 left-0 px-2 mt-24 w-full h-full bg-background transition-transform duration-300 sm:relative sm:w-fit sm:-translate-x-0 sm:mt-0 sm:bg-transparent {!isMainNavMenuOpen
		? '-translate-x-full'
		: ''}"
>
	<slot />
</nav>

<MainNavMenuToggleBtn bind:isMainNavMenuOpen />
