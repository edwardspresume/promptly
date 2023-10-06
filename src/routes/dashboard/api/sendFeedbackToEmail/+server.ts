
export const POST: RequestHandler = async ({ request }) => {
	const feedbackMessage = await request.text();

	try {

		return new Response(null, {
			status: 200,
			statusText: 'Message sent!'
		});
	} catch (error) {


		return new Response(null, {
			status: 500,
			statusText:
		});
	}
};
