<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { page } from '$app/stores';

	import { OAuthProviderSchema } from '$authSchemas/authSchemas';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	export let formType: 'signIn' | 'signUp';

	const authText = formType === 'signIn' ? 'Sign in' : 'Sign up';
	const providers = OAuthProviderSchema.shape.provider.options;

	const { enhance, message } = superForm($page.data.oAuthForm, {
		id: `oauth${formType}`,
		taintedMessage: false,

		onSubmit: ({ formData, action }) => {
			const formProvider = action.searchParams.get('provider');

			formData.append('provider', String(formProvider));
		}
	});
</script>

{#if $message}
	<p class="mb-2 text-sm text-center text-red-500">{$message.text}</p>
{/if}

<form use:enhance method="Post" aria-label="Oauth {authText}" class="flex flex-wrap gap-4">
	{#each providers as provider}
		<Button
			type="submit"
			formaction="?/oauth&provider={provider}"
			title="{authText} using {provider}"
			aria-label="{authText} using {provider}"
			class="flex items-center justify-center flex-grow gap-2 font-bold"
		>
			<Icon name={provider.toLowerCase()} size={26} />

			<span>{provider}</span>
		</Button>
	{/each}
</form>
