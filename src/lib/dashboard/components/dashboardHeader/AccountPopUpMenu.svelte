<script>
	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import * as Popover from '$globalComponents/ui/popover';
	import AccountPopUpMenuItems from './AccountPopUpMenuItems.svelte';

	$: userAvatarUrl = $userProfileStore?.avatarUrl;
	$: emailInitial = $userProfileStore?.email?.charAt(0).toUpperCase() ?? '';
	$: fullNameInitial = $userProfileStore?.fullName?.split(' ')[0]?.[0]?.toUpperCase() ?? '';
</script>

<Popover.Root>
	<Popover.Trigger
		type="button"
		class="w-10 h-10 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"
	>
		{#if userAvatarUrl}
			<img src={userAvatarUrl} alt="Profile avatar" class="w-full h-full rounded-full" />
		{:else}
			{fullNameInitial || emailInitial}
		{/if}
	</Popover.Trigger>

	<Popover.Content class="p-2 mt-2 w-fit">
		<menu class="grid gap-2">
			<AccountPopUpMenuItems />
		</menu>
	</Popover.Content>
</Popover.Root>
