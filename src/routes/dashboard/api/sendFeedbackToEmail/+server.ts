import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

import { SECRET_GMAIL_PASS, SECRET_GMAIL_USERNAME } from '$env/static/private';
import type { RequestHandler } from './$types';

/**
 * Creates a nodemailer Transporter instance
 * @returns {nodemailer.Transporter} nodemailer Transporter instance
 */
function createEmailTransport() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: SECRET_GMAIL_USERNAME,
			pass: SECRET_GMAIL_PASS
		}
	});
}

/**
 *  Sends an email using nodemailer
 * @param {object} mailOptions nodemailer mail options
 * @returns {Promise<nodemailer.SentMessageInfo>} nodemailer SentMessageInfo
 * @see https://nodemailer.com/about/
 * @see https://nodemailer.com/message/
 */
async function sendEmail(mailOptions: object) {
	const emailTransporter = createEmailTransport();
	return emailTransporter.sendMail(mailOptions);
}

export const POST: RequestHandler = async ({ request }) => {
	const feedbackMessage = await request.text();

	try {
		const sanitizedFeedbackMessage = sanitizeHtml(feedbackMessage);

		await sendEmail({
			from: SECRET_GMAIL_USERNAME,
			to: SECRET_GMAIL_USERNAME,
			subject: `Promptly Feedback`,
			html: `
                <h2>New Feedback</h2>
                <p>${sanitizedFeedbackMessage}</p>
            `
		});

		return new Response(null, {
			status: 200,
			statusText: 'Message sent!'
		});
	} catch (error) {
		console.error('Error sending feedback email:', error);

		return new Response(null, {
			status: 500,
			statusText: `There was an error sending your message. Please try again later.`
		});
	}
};
