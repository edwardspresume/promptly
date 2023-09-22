<script>
	export let isMainNavMenuOpen = false;
	export let ariaControls = 'menu';
</script>

<button
	aria-expanded={isMainNavMenuOpen}
	aria-controls={ariaControls}
	class="relative px-2 border rounded ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:hidden"
>
	<input
		type="checkbox"
		bind:checked={isMainNavMenuOpen}
		aria-label="Navigation main Toggle"
		class="absolute top-0 left-0 z-10 h-full opacity-0 cursor-pointer"
	/>

	<div></div>
	<div></div>
	<div></div>
</button>

<style lang="postcss">
	button div {
		@apply bg-foreground w-7 h-[0.1875rem] rounded transition-all duration-300 ease-in-out;
	}

	button div:not(:last-of-type) {
		@apply mb-[0.375rem];
	}

	button input:checked ~ div:nth-child(3) {
		opacity: 0;
	}

	button input:checked ~ div:nth-child(2) {
		transform: translateY(0.5625rem) rotate(45deg);
	}

	button input:checked ~ div:nth-child(4) {
		transform: translateY(-0.5625rem) rotate(-45deg);
	}
</style>
