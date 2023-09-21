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
	DASHBOARD_COMMUNITY_PROMPTS = '/dashboard/community-prompts',
	DASHBOARD_SHARED_PROMPT = '/dashboard/shared-prompt',

	DASHBOARD_ACCOUNT = '/dashboard/account',
	DASHBOARD_PROFILE = '/dashboard/account/profile',
	DASHBOARD_BILLING = '/dashboard/account/billing',

	MARKETING_LANDING = '/',
	MARKETING_PRICING = '/pricing'
}

export type NavLink = {
	href: string;
	title: string;
	isExternal?: boolean;
};

export const createNavLink = (title: string, href: string, isExternal?: boolean): NavLink => ({
	title,
	href,
	isExternal
});

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & Record<string, never>;
