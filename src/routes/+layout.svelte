<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	import { invalidate, onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	import '$globalStyles';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

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
