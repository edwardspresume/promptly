<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import type { Size } from '$globalComponents/ui/button';
	import { cn } from '$globalUtils';

	import Icon from '$globalComponents/Icon.svelte';
	import type { Variant } from '$globalComponents/ui/button';
	import Button from '$globalComponents/ui/button/button.svelte';

	let className: HTMLButtonAttributes['class'] = undefined;

	export let size: Size = 'lg';
	export { className as class };
	export let disabled: boolean = false;
	export let showSpinner: boolean | null = null;
	export let buttonVariant: Variant = 'default';
</script>

<Button
	{size}
	{disabled}
	type="submit"
	variant={buttonVariant}
	aria-disabled={disabled}
	class={cn('font-bold flex gap-2 items-center w-full', className)}
>
	{#if showSpinner === null ? disabled : showSpinner}
		<Icon name="loading-spinner" class="animate-spin" />
	{/if}

	<slot>Submit</slot>
</Button>
