<script>
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import { invalidate, onNavigate } from '$app/navigation';

	import '$globalStyles';

	import { isNavigatingStore } from '$globalStores/isNavigatingStore';

	export let data;

	// Initialize the data
	let { supabase, session } = data;

	// Update the data if it changes
	$: ({ supabase, session } = data);

	$: $isNavigatingStore = !!$navigating;

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

<slot />
