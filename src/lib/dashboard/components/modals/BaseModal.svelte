<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { createEventDispatcher } from 'svelte';

	import { closeDialogOnOutsideClick } from '$dashboardUtils/functions';

	import CloseModalBtn from './CloseModalBtn.svelte';

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
	class="max-w-md p-6 border rounded-lg shadow-lg w-[96%] bg-background backdrop:bg-background/80 backdrop:backdrop-blur-sm text-foreground max-h-[100dvh] overflow-y-auto"
>
	<header class="mb-12">
		<div class="flex items-center justify-between gap-6">
			<h3 class="text-xl font-bold leading-none">{modalTitle}</h3>

			<CloseModalBtn {dialogElement} />
		</div>

		<p class="mt-1 text-sm text-muted-foreground">
			{modalDescription}
		</p>
	</header>

	<slot />

	<SvelteToast target="baseModal" options={{ intro: { y: -100 } }} />
</dialog>

<style lang="postcss">
	dialog {
		animation: fadeIn 0.4s ease-in-out;

		&::backdrop {
			animation: fadeInBackdrop 0.4s ease-in-out;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeInBackdrop {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
