export type NavLink = {
	title: string;
	href: string;
	ariaLabel: string;
};

export enum RoutePaths {
	DASHBOARD_PROMPTS = '/dashboard/prompts',
	AUTH = '/auth'
}

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
