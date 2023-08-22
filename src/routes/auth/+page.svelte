<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import AuthForm from '$authComponents/AuthForm.svelte';
	import * as Tabs from '$globalComponents/ui/tabs';

	export let data: PageData;

	let initialTabValue = $page.url.searchParams.get('signup') === 'true' ? 'signUp' : 'signIn';
</script>

<main class="grid grid-cols-1 lg:grid-cols-[minmax(0,40rem),1fr] min-h-[100dvh] items-center">
	<section class="w-full max-w-xl p-4 mx-auto lg:p-16">
		<Tabs.Root value={initialTabValue}>
			<Tabs.List class="grid w-full grid-cols-2 mb-3">
				<Tabs.Trigger value="signIn">Sign in</Tabs.Trigger>
				<Tabs.Trigger value="signUp">Sign up</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="signIn">
				<AuthForm authFormData={data.authEmailForm} formType="signIn" />
			</Tabs.Content>

			<Tabs.Content value="signUp">
				<AuthForm authFormData={data.authEmailForm} formType="signUp" />
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<figure
		class="hidden min-h-full bg-center bg-cover border-l border-gray-700 lg:block"
		style="background-image: url('/test.png');"
	/>
</main>
