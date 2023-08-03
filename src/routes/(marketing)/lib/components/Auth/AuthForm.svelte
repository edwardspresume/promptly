<script>
    import { superForm } from 'sveltekit-superforms/client';

    import { EmailAuthSchema } from '$marketingUtils/validation/EmailAuthSchema';

    import Icon from '$globalComponents/Icon.svelte';
    import SubmitButton from '$globalComponents/SubmitButton.svelte';

    export let authFormData;

    const { form, errors, enhance, delayed } = superForm(authFormData, {
        id: 'signUp',
        resetForm: true,
        taintedMessage: null,
        validators: EmailAuthSchema,
    });
</script>

<form
    use:enhance
    method="Post"
    action="?/signUp"
    aria-label="Sign up Form"
    class="grid gap-5"
>
    <fieldset>
        <button
            type="button"
            formaction="?/signUp&provider=google"
            aria-label="Continue with Google"
            class="flex items-center justify-center w-full gap-2 p-3 transition-opacity rounded-md bg-secondary hover:opacity-80"
        >
            <Icon name="google" />
            <span> Continue with Google </span>
        </button>
    </fieldset>

    <div class="flex items-center">
        <div class="flex-grow mr-3 border-t border-gray-500" />
        <div>or</div>
        <div class="flex-grow ml-3 border-t border-gray-500" />
    </div>

    <label class="grid gap-1">
        <span>Email</span>

        <input
            bind:value={$form.email}
            type="email"
            name="email"
            aria-label="Email"
            autocomplete="email"
            enterkeyhint="enter"
            placeholder="you@example.com"
        />

        <small class="text-red-500">{$errors.email ?? []}</small>
    </label>

    <SubmitButton title="Sign up" extraStyles="mt-5" disabled={$delayed} />
</form>
