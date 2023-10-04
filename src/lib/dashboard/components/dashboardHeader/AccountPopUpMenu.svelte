<script>
	import { RoutePaths } from '$globalTypes';

	import { isFeedbackModalOpen } from '$dashboardStores/feedbackModalStore';
	import { userProfileStore } from '$dashboardStores/userProfileStore';

	import Icon from '$globalComponents/Icon.svelte';
	import * as DropdownMenu from '$globalComponents/ui/dropdown-menu';
	import ExportDataBtn from './ExportDataBtn.svelte';
	import LoginLogoutBtn from './LoginLogoutBtn.svelte';
	import UpgradeToProBtn from './UpgradeToProBtn.svelte';

	$: userAvatarUrl = $userProfileStore?.avatarUrl;
	$: userEmail = $userProfileStore?.email;
	$: userFullName = $userProfileStore?.fullName;
	$: emailInitial = userEmail?.charAt(0).toUpperCase() ?? '';
	$: fullNameInitial = $userProfileStore?.fullName?.split(' ')[0]?.[0]?.toUpperCase() ?? '';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger type="button" class="w-10 h-10 rounded-full">
		{#if userAvatarUrl}
			<img src={userAvatarUrl} alt="Profile avatar" class="rounded-full" />
		{:else}
			<span
				class="grid h-full text-xl text-white rounded-full place-items-center bg-gradient-to-b from-blue-500 to-purple-500"
			>
				{fullNameInitial || emailInitial}
			</span>
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="p-1 mt-2 account-dropdown-menu bg-background">
		<DropdownMenu.Group>
			{#if userEmail}
				<DropdownMenu.Label class="grid">
					<span>{userFullName || userEmail}</span>
					{#if userFullName}<span class="font-normal text-muted-foreground">{userEmail}</span>{/if}
				</DropdownMenu.Label>

				<DropdownMenu.Separator />
			{/if}

			{#if !$userProfileStore || $userProfileStore.subscriptionStatus !== 'active'}
				<DropdownMenu.Item>
					<UpgradeToProBtn />
				</DropdownMenu.Item>
			{/if}

			{#if $userProfileStore}
				<DropdownMenu.Item>
					<a href={RoutePaths.DASHBOARD_PROFILE}>
						<Icon name="person" />
						<span>Profile</span>
					</a>
				</DropdownMenu.Item>
			{/if}
			<DropdownMenu.Item>
				<button
					title="Feedback"
					aria-label="Feedback"
					on:click={() => isFeedbackModalOpen.set(true)}
				>
					<Icon name="feedback" />
					<span>Feedback</span>
				</button>
			</DropdownMenu.Item>

			{#if !$userProfileStore}
				<DropdownMenu.Item>
					<ExportDataBtn />
				</DropdownMenu.Item>
			{/if}

			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<LoginLogoutBtn />
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<style lang="postcss">
	:global(.account-dropdown-menu a),
	:global(.account-dropdown-menu button) {
		@apply flex items-center gap-2 py-1 text-foreground w-full;
	}
</style>
