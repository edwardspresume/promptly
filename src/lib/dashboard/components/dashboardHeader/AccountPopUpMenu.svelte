<script>
	import * as Avatar from '$globalComponents/ui/avatar';
	import * as Popover from '$globalComponents/ui/popover';
	import AccountPopUpMenuItems from './AccountPopUpMenuItems.svelte';
</script>

<Popover.Root>
	<Popover.Trigger class="rounded-full">
		<Avatar.Root>
			<Avatar.Image src="" alt="" />
			<Avatar.Fallback class="bg-gradient-to-b from-blue-500 to-purple-500" />
		</Avatar.Root>
	</Popover.Trigger>

	<Popover.Content class="p-2 mt-2 w-fit">
		<ul class="grid gap-2">
			<AccountPopUpMenuItems />
		</ul>
	</Popover.Content>
</Popover.Root>
