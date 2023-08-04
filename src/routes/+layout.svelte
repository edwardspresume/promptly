<script lang="ts">
    import { invalidate } from '$app/navigation';
    import { onMount } from 'svelte';

    import { userSessionStore } from '$globalStores/userSessionStore';

    export let data;

    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    $: if (session?.user) {
        userSessionStore.set(session?.user);
    }

    onMount(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        });

        return () => subscription.unsubscribe();
    });
</script>

<slot />
