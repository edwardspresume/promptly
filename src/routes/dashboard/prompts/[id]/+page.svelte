<script lang="ts">
	import type { PageData } from './$types';

	import Button from '$globalComponents/ui/button/button.svelte';
	import * as Card from '$globalComponents/ui/card';

	import InputField from '$globalComponents/form/InputField.svelte';
	import TextArea from '$globalComponents/form/TextArea.svelte';

	export let data: PageData;

	const { sharedPrompt } = data;
</script>

<Card.Root role="article" aria-label="Shared Prompt Details" class="w-[96%] max-w-lg bg-background">
	<Card.Header>
		<Card.Title>Shared Prompt</Card.Title>
		<Card.Description>Created by {sharedPrompt.fromUser}</Card.Description>
	</Card.Header>

	<Card.Content class="grid gap-5">
		<InputField type="text" label="Title" value={sharedPrompt.title} readonly />

		<fieldset class="grid gap-1">
			<TextArea label="Description" value={sharedPrompt.description} readonly />
		</fieldset>
	</Card.Content>

	<Card.Footer>
		<Button>Save Prompt</Button>
	</Card.Footer>
</Card.Root>
