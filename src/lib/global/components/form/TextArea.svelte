<script lang="ts">
	import type { EnterKeyHint } from '$globalTypes';

	import Label from '$globalComponents/ui/label/label.svelte';
	import Textarea from '$globalComponents/ui/textarea/textarea.svelte';

	export let value: string = '';
	export let name: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let spellcheck: boolean = true;
	export let textAreaId: string = 'textarea';
	export let enterkeyhint: EnterKeyHint = 'enter';
	export let labelIsScreenReaderOnly: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let errorMessage: object | undefined = undefined;

	$: valueLength = value.length;
</script>

<Label for={textAreaId} class="leading-none">
	<span class={labelIsScreenReaderOnly ? 'sr-only' : ''}>{label}</span>

	{#if maxlength}
		<span class="text-xs text-muted-foreground">
			{valueLength}/{maxlength}
		</span>
	{/if}
</Label>

{#if errorMessage}
	<p class="text-sm text-red-500 error-message">{errorMessage}</p>
{/if}

<Textarea
	{name}
	dir="auto"
	bind:value
	{spellcheck}
	{placeholder}
	{enterkeyhint}
	id={textAreaId}
	aria-label={label}
	aria-invalid={errorMessage ? 'true' : undefined}
	{...$$restProps}
/>
