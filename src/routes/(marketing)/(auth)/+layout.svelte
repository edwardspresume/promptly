<script lang="ts">
    import type { LayoutData } from './$types';

    import Logo from '$globalComponents/Logo.svelte';


    export let data: LayoutData;
</script>

<div class="h-[100dvh] bg-[#14284b]">
    <header>
        <Logo href='/dashboard' title='Go to homepage' />
    </header>
    <main>
        <slot />
    </main>
</div>
