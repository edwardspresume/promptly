<script>
	import { page } from '$app/stores';
	import { userProfileStore } from '$dashboardStores/userProfileStore';
	import { RoutePaths } from '$globalTypes';

	import Icon from '$globalComponents/Icon.svelte';
	import Button from '$globalComponents/ui/button/button.svelte';

	const handleSignOut = async () => await $page.data.supabase?.auth.signOut();

	$: isLoggedIn = Boolean($userProfileStore);

	$: buttonInfo = isLoggedIn
		? {
				label: 'Logout',
				iconName: 'logout',
				ariaLabel: 'Logout from your account',
				onClick: handleSignOut,
				href: undefined
		  }
		: {
				label: 'Login',
				iconName: 'login',
				ariaLabel: 'Go to the sign in page',
				onClick: undefined,
				href: RoutePaths.AUTH
		  };
</script>

<Button
	variant="ghost"
	href={buttonInfo.href}
	on:click={buttonInfo.onClick}
	aria-label={buttonInfo.ariaLabel}
>
	<Icon name={buttonInfo.iconName} />
	<span>{buttonInfo.label}</span>
</Button>
