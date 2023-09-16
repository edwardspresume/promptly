export type AlertType = 'success' | 'error' | 'warning' | 'info';

export type AlertMessage = {
	alertType: AlertType;
	alertText: string;
};

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

export enum RoutePaths {
	AUTH = '/auth',
	SIGNUP = '/auth?signup=true',

	DASHBOARD_PROMPTS = '/dashboard/prompts',
	DASHBOARD_TAGS = '/dashboard/tags',
	DASHBOARD_PROFILE = '/dashboard/profile',
    DASHBOARD_BILLING = '/dashboard/billing',
	DASHBOARD_SHARED_PROMPT = '/dashboard/shared-prompt',

	MARKETING_LANDING = '/',
	MARKETING_PRICING = '/pricing'
}

export type NavLink = {
	href: string;
	title: string;
	ariaLabel: string;
	isExternal?: boolean;
};

export const createNavLink = (
	title: string,
	href: string,
	ariaLabel: string,
	isExternal?: boolean
): NavLink => ({
	title,
	href,
	ariaLabel,
	isExternal
});
