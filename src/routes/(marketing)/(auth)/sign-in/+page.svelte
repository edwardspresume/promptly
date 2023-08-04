<script lang="ts">
    import type { PageData } from './$types';

    import AuthForm from '$marketingComponents/Auth/AuthForm.svelte';
    import AuthHeader from '$marketingComponents/Auth/AuthHeader.svelte';

    export let data: PageData;
</script>

<AuthHeader heading="Welcome back" subheading="Sign in to your account" />

<AuthForm
    formAction="signIn"
    buttonTitle="Sign in"
    authFormData={data.emailAuthForm}
/>

<p class="mt-10 text-center">
    Don't haven an account? <a href="/sign-up" class="underline">Sign up</a>
</p>
