<script lang="ts">
    import type { PageData } from './$types';

    import Form from '../lib/components/Form.svelte';
    import Header from '../lib/components/Header.svelte';

    export let data: PageData;
</script>

<div>
    <Header heading="Sign up" subheading="Create an account to get started." />

    <Form />

    <p class="mt-10 text-center">
        Already have an account? <a href="/sign-in" class="underline">Sign in</a
        >
    </p>
</div>
