import { RoutePaths, createNavLink, type NavLink } from '$globalTypes';

export const marketingLinks: NavLink[] = [
	createNavLink('Dashboard', RoutePaths.DASHBOARD_PROMPTS, 'Go to the dashboard'),
	createNavLink('Sign In', RoutePaths.AUTH, 'Go to the sign in page'),
	createNavLink('Sign Up', RoutePaths.SIGNUP, 'Go to the sign up page')
];
