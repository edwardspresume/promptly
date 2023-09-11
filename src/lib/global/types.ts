export type AlertType = 'success' | 'error' | 'warning' | 'info';

export type AlertMessage = {
	alertType: AlertType;
	alertText: string;
};

export type NavLink = {
	href: string;
	title: string;
	ariaLabel: string;
	isExternal?: boolean;
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
