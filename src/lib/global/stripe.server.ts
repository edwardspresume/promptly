import { SECRET_STRIPE_API_KEY } from '$env/static/private';
import Stripe from 'stripe';

export const stripe = new Stripe(SECRET_STRIPE_API_KEY, {
	apiVersion: '2023-08-16',
	typescript: true
});
