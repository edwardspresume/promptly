<script lang="ts">
	import Button from '$globalComponents/ui/button/button.svelte';

	export let title: string = 'Submit';
	export let disabled: boolean = false;
	export let extraStyles: string = '';
	export let size: 'default' | 'sm' | 'lg' | 'icon' = 'lg';
</script>

<Button
	{size}
	{disabled}
	type="submit"
	aria-label={title}
	aria-disabled={disabled}
	class="font-bold {extraStyles}"
>
	{title}
</Button>
