<script lang="ts">
	import type { EnterKeyHint } from '$globalTypes';

	import Input from '$globalComponents/ui/input/input.svelte';
	import Label from '$globalComponents/ui/label/label.svelte';

	export let type: string;
	export let value: string = '';
	export let name: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let autocomplete: string = 'on';
	export let errorMessage: object | undefined;
	export let enterkeyhint: EnterKeyHint = 'enter';
	export let labelIsScreenReaderOnly: boolean = false;
</script>

<Label class="grid gap-2">
	<span class={labelIsScreenReaderOnly ? 'sr-only' : ''}>
		{label}
	</span>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}

	<Input
		{name}
		{type}
		bind:value
		{placeholder}
		{autocomplete}
		{enterkeyhint}
		spellcheck="true"
		aria-label={label}
		aria-invalid={errorMessage ? 'true' : undefined}
		{...$$restProps}
	/>
</Label>

<style>
	:global(input[aria-invalid='true']) {
		border-color: red;
	}
</style>
