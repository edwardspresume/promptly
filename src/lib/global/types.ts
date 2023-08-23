export type EnterKeyHint =
	| 'search'
	| 'enter'
	| 'done'
	| 'go'
	| 'next'
	| 'previous'
	| 'send'
	| null
	| undefined;

export type FormStatusMessage = { status: 'error' | 'success' | 'warning'; text: string };
