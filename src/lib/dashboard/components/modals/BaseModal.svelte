<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';

	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { createEventDispatcher } from 'svelte';

	import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';
	import { cn } from '$globalUtils';

	import CloseModalBtn from './CloseModalBtn.svelte';

	let className: HTMLDialogAttributes['class'] = undefined;
	export { className as class };
	export let dialogElement: HTMLDialogElement;
	export let modalTitle: string;
	export let modalDescription: string = '';

	const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialogElement}
	on:close={() => dispatch('close')}
	on:click={(event) => closeDialogOnOutsideClick(event, dialogElement)}
	class={cn('max-h-[100dvh] max-w-xl overflow-y-auto scaleInWithFadeKeyFrame', className)}
>
	<header class="mb-12">
		<div class="flex items-center justify-between gap-6">
			<h3 class="text-xl leading-none">{modalTitle}</h3>

			<CloseModalBtn {dialogElement} />
		</div>

		{#if modalDescription}
			<p class="mt-1 text-sm text-muted-foreground">
				{modalDescription}
			</p>
		{/if}
	</header>

	<slot />

	<SvelteToast target="baseModal" options={{ intro: { y: -100 } }} />
</dialog>
