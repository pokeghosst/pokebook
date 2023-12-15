import { json } from '@sveltejs/kit';

import googleClient from '$lib/client/GoogleOAuthClient';

export function GET() {
	return json(
		googleClient.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/drive.file',
			include_granted_scopes: true
		})
	);
}
