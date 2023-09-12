<script lang="ts">
	import { cn } from '$globalUtils';
	import { Label as LabelPrimitive } from 'bits-ui';

	type $$Props = LabelPrimitive.Props;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root
	class={cn(
		'text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...$$restProps}
>
	<slot />
</LabelPrimitive.Root>
