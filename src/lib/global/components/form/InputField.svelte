<script lang="ts">
	import type { EnterKeyHint } from '$globalTypes';

	import Input from '$globalComponents/ui/input/input.svelte';

	export let type: string;
	export let value: string = '';
	export let name: string = '';
	export let label: string = '';
	export let placeholder: string = '';
	export let spellcheck: boolean = true;
	export let autocomplete: string = 'on';
	export let enterkeyhint: EnterKeyHint = 'next';
	export let labelIsScreenReaderOnly: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let errorMessage: object | undefined = undefined;

	$: valueLength = value.length;
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label
	class="grid gap-1 text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
>
	<div>
		<span class={labelIsScreenReaderOnly ? 'sr-only' : ''}>{label}</span>

		{#if maxlength}
			<span class="text-xs text-muted-foreground">
				{valueLength}/{maxlength}
			</span>
		{/if}
	</div>

	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}

	<Input
		{name}
		{type}
		dir="auto"
		bind:value
		{maxlength}
		{spellcheck}
		{placeholder}
		{autocomplete}
		{enterkeyhint}
		aria-label={label}
		aria-invalid={errorMessage ? 'true' : undefined}
		{...$$restProps}
	/>
</label>
