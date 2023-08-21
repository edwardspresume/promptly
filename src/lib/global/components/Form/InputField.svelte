<script lang="ts">
	import type { EnterKeyHint } from '$lib/global/types';

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

	let id = `${name}-1`;
</script>

<fieldset>
	<Label for={id} class={labelIsScreenReaderOnly ? 'sr-only' : ''}>
		{label}
	</Label>

	<Input
		{id}
		{name}
		{type}
		bind:value
		{placeholder}
		{autocomplete}
		{enterkeyhint}
		spellcheck="true"
		aria-label={label}
		{...$$restProps}
	/>

	<small class="text-red-500 text-muted-foreground">{errorMessage}</small>
</fieldset>
