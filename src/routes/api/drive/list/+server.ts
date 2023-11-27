import { json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

export const GET: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const drive = google.drive('v3');
	const response = await drive.files.list({
		q: `'${url.searchParams.get(
			'pokebookFolderId'
		)}' in parents and trashed=false and not name contains '_note'`,
		orderBy: 'createdTime desc',
		auth: googleClient,
		fields: 'nextPageToken,files(id,name,createdTime,properties)'
	});

	console.log(response.data.files);

	return json(response.data.files);
};
