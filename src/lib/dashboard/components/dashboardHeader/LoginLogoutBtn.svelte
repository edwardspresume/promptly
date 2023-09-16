<script>
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';

	import { RoutePaths } from '$globalTypes';

	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import Icon from '$globalComponents/Icon.svelte';

	const handleSignOut = async () => {
		await $page.data.supabase?.auth.signOut();

		invalidateAll();
	};

	$: isLoggedIn = Boolean($userProfileStore);
</script>

{#if isLoggedIn}
	<button type="button" aria-label="Logout from your account" on:click={handleSignOut}>
		<Icon name="logout" />
		<span>Logout</span>
	</button>
{:else}
	<a href={RoutePaths.AUTH} aria-label="Go to the sign in page">
		<Icon name="login" />
		<span>Log in</span>
	</a>
{/if}
