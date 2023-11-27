import { json, type RequestHandler } from '@sveltejs/kit';
import googleClient from '$lib/util/GoogleOAuthClient';

export const POST: RequestHandler = async ({ request }) => {
	const { code } = await request.json();
	if (code !== null) {
		const { tokens } = await googleClient.getToken(code);
		googleClient.setCredentials(tokens);
		return json({
			accessToken: tokens.access_token,
			expiration: tokens.expiry_date
		});
	} else {
		return new Response('', { status: 401 });
	}
};
