import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

import Stripe from 'https://esm.sh/stripe?target=deno&no-check';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
	// This is needed to use the Fetch API rather than relying on the Node http
	// package.
	apiVersion: '2023-08-16',
	httpClient: Stripe.createFetchHttpClient()
});

// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (request) => {
	const signature = request.headers.get('Stripe-Signature');

	// First step is to verify the event. The .text() method must be used as the
	// verification relies on the raw request body rather than the parsed JSON.
	const body = await request.text();
	let receivedEvent;
	try {
		receivedEvent = await stripe.webhooks.constructEventAsync(
			body,
			signature!,
			Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')!,
			undefined,
			cryptoProvider
		);
	} catch (err) {
		return new Response(err.message, { status: 400 });
	}

	console.log(receivedEvent);
	console.log(`🔔 Event received: ${receivedEvent.id}`);
	return new Response(JSON.stringify({ ok: true }), { status: 200 });
});

 