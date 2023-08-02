<script lang="ts">
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    import type { LayoutData } from './$types';

    export let data: LayoutData;

    inject({ mode: dev ? 'development' : 'production' });
</script>

<slot />
