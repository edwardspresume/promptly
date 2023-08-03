<script lang="ts">
    import type { PageData } from './$types';

    import AuthForm from '$marketingComponents/Auth/AuthForm.svelte';
    import AuthHeader from '$marketingComponents/Auth/AuthHeader.svelte';

    export let data: PageData;
</script>

<AuthHeader heading="Sign up" subheading="Create an account to get started." />

<AuthForm authFormData={data.emailAuthForm} />

<p class="mt-10 text-center">
    Already have an account? <a href="/sign-in" class="underline">Sign in</a>
</p>
