<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import type { Size } from '$globalComponents/ui/button';
	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;

	export let size: Size = 'lg';
	export { className as class };
	export let disabled: boolean = false;
	export let showSpinner: boolean | null = null;
</script>

<Button
	{size}
	{disabled}
	type="submit"
	aria-disabled={disabled}
	class={cn('font-bold flex gap-2 items-center w-full', className)}
>
	{#if showSpinner === null ? disabled : showSpinner}
		<Icon name="loading-spinner" class="animate-spin" />
	{/if}

	<slot>Submit</slot>
</Button>
