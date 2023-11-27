import { error, json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

export const GET: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const pokebookFolderId = url.searchParams.get('pokebookFolderId');

	if (pokebookFolderId != null) {
		const drive = google.drive('v3');
		const results = await drive.files.get({
			fileId: pokebookFolderId,
			fields: 'modifiedTime',
			auth: googleClient
		});
		return json(results.data.modifiedTime);
	} else {
		throw error(400, {
			message: 'PokeBook folder ID missing'
		});
	}
};
