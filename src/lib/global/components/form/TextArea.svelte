<script lang="ts">
	import type { EnterKeyHint } from '$globalTypes';

	import Label from '$globalComponents/ui/label/label.svelte';
	import Textarea from '$globalComponents/ui/textarea/textarea.svelte';

	export let value: string = '';
	export let name: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let spellcheck: boolean = true;
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

	<Textarea
		{name}
		dir="auto"
		bind:value
		{spellcheck}
		{placeholder}
		{enterkeyhint}
		aria-label={label}
		aria-invalid={errorMessage ? 'true' : undefined}
		{...$$restProps}
	/>
</Label>
