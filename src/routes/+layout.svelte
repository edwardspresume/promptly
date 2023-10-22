<script lang="ts">
	import { invalidate, onNavigate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import { getFlash } from 'sveltekit-flash-message';

	import { Bar } from '@bobbymannino/svelte-progress';

	import { isNavigatingStore } from '$globalStores/isNavigatingStore';

	import '$globalStyles';

	export let data: LayoutData;

	// Initialize the data
	let { supabase, session } = data;

	// Update the data if it changes
	$: ({ supabase, session } = data);

	$: $isNavigatingStore = !!$navigating;

	getFlash(page);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((oldStateCaptureResolve) => {
			document.startViewTransition(async () => {
				oldStateCaptureResolve();
				await navigation.complete;
			});
		});
	});

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	inject({ mode: dev ? 'development' : 'production' });
</script>

<Bar color="#6D28D9" size="big" shadow="show" speed="fast" />

<slot />
