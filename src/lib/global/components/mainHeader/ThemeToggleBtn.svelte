<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;
	export { className as class };

	//  Variable to store the dark mode state.
	let isDarkMode: boolean = false;

	/**
	 * Function to toggle the dark mode of the application.
	 * This function reads the current dark mode state, toggles it, and updates
	 * the DOM and localStorage accordingly.
	 */
	function toggleDarkMode() {
		isDarkMode = !isDarkMode;
		localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
		document.documentElement.classList.toggle('dark', isDarkMode);
	}

	// Reactive statement to initialize the dark mode state from localStorage or system preference.
	$: if (typeof window !== 'undefined') {
		const storedValue = localStorage.getItem('isDarkMode');

		isDarkMode = storedValue
			? (JSON.parse(storedValue) as boolean)
			: window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	$: iconName = isDarkMode ? 'sun' : 'moon';
	$: buttonText = isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode';
</script>

<Button
	size="icon"
	role="switch"
	type="button"
	variant="ghost"
	aria-live="polite"
	title={buttonText}
	aria-label={buttonText}
	aria-checked={isDarkMode}
	on:click={toggleDarkMode}
	class={cn(className)}
>
	<Icon name={iconName} />
</Button>
