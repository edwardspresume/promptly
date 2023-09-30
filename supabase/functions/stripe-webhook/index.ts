import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@latest';
import Stripe from 'https://esm.sh/stripe@latest?target=deno&no-check';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
	apiVersion: '2023-08-16',
	// This is needed to use the Fetch API rather than relying on the Node http
	// package.
	httpClient: Stripe.createFetchHttpClient()
});

// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
	Deno.env.get('SUPABASE_URL'),
	Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

serve(async (request) => {
	const signature = request.headers.get('Stripe-Signature');

	// First step is to verify the event. The .text() method must be used as the
	// verification relies on the raw request body rather than the parsed JSON.
	const body = await request.text();
	let receivedEvent;
	try {
		receivedEvent = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET'),
			undefined,
			cryptoProvider
		);
	} catch (err) {
		return new Response(err.message, { status: 400 });
	}

	if (receivedEvent.type === 'customer.subscription.updated') {
		const subscription = receivedEvent.data.object;
		const customerId = subscription.customer;
		const newStatus = subscription.status;

		const { error } = await supabase
			.from('profiles_table')
			.update({ subscription_status: newStatus })
			.eq('stripe_customer_id', customerId);

		if (error) {
			console.error('❌ Error updating user profile subscription status: ', error);

			return new Response('Failed to update subscription status', { status: 500 });
		} else {
			console.log('✅ User profile Subscription status updated: ', newStatus);
		}
	}

	console.log(`🔔 Event received: ${receivedEvent.type}`, receivedEvent);

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
