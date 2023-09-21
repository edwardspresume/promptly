import { RoutePaths, createNavLink, type NavLink } from '$globalTypes';

type DashboardLinks = {
	mainNav: NavLink[];
	accountNav: NavLink[];
};

const mainNav: NavLink[] = [
	createNavLink('My Prompts', RoutePaths.DASHBOARD_PROMPTS),
	createNavLink('My Tags', RoutePaths.DASHBOARD_TAGS),
	createNavLink('Community Prompts', RoutePaths.DASHBOARD_COMMUNITY_PROMPTS),
	createNavLink('Prompt Tester', RoutePaths.DASHBOARD_PROMPT_TESTER)
];

const accountNav: NavLink[] = [
	createNavLink('Profile', RoutePaths.DASHBOARD_PROFILE),
	createNavLink('Billing', RoutePaths.DASHBOARD_BILLING)
];

export const dashboardLinks: DashboardLinks = {
	mainNav,
	accountNav
};
