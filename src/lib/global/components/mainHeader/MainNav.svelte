<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import MainNavMenuToggleBtn from './MainNavMenuToggleBtn.svelte';

	let isMainNavMenuOpen = false;

	let className: HTMLAttributes<HTMLElement>['class'] = undefined;
	export { className as class };
</script>

<nav id="main-nav"
	class={cn(
		`absolute top-0 left-0 px-2 mt-24 w-full h-full bg-background transition-transform duration-300 sm:relative sm:w-fit sm:-translate-x-0 sm:mt-0 sm:bg-transparent ${
			!isMainNavMenuOpen ? '-translate-x-full' : ''
		}`,
		className
	)}
>
	<slot />
</nav>

<MainNavMenuToggleBtn bind:isMainNavMenuOpen />
