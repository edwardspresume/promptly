<script>
	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import * as Avatar from '$globalComponents/ui/avatar';
	import * as Popover from '$globalComponents/ui/popover';
	import AccountPopUpMenuItems from './AccountPopUpMenuItems.svelte';

	$: userAvatarUrl = $userProfileStore?.avatarUrl;
	$: emailInitial = $userProfileStore?.email?.charAt(0).toUpperCase() ?? '';
	$: fullNameInitial = $userProfileStore?.fullName?.split(' ')[0]?.[0]?.toUpperCase() ?? '';
</script>

<Popover.Root>
	<Popover.Trigger type="button" class="rounded-full">
		<Avatar.Root>
			{#if userAvatarUrl}
				<Avatar.Image src={userAvatarUrl} alt="Profile avatar" />
			{:else}
				<Avatar.Fallback class="bg-gradient-to-b from-blue-500 to-purple-500" style="display:block">
					{fullNameInitial || emailInitial}
				</Avatar.Fallback>
			{/if}
		</Avatar.Root>
	</Popover.Trigger>

	<Popover.Content class="p-2 mt-2 w-fit">
		<menu class="grid gap-2">
			<AccountPopUpMenuItems />
		</menu>
	</Popover.Content>
</Popover.Root>
