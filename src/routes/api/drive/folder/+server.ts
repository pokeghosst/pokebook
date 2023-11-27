import { json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

import { PUBLIC_POKEBOOK_FOLDER_NAME } from '$env/static/public';

export const GET: RequestHandler = async ({ request }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	let pokebookFolderId;
	let pokebookFolderModifiedTime;

	const drive = google.drive('v3');
	const results = await drive.files.list({
		q: "mimeType='application/vnd.google-apps.folder' and name='PokeBook'",
		fields: 'files(id,modifiedTime)',
		auth: googleClient
	});

	if (results.data.files && results.data.files.length > 0) {
		pokebookFolderId = results.data.files[0].id;
		pokebookFolderModifiedTime = results.data.files[0].modifiedTime;
	} else {
		const response = await drive.files.create({
			requestBody: {
				name: PUBLIC_POKEBOOK_FOLDER_NAME,
				mimeType: 'application/vnd.google-apps.folder'
			},
			fields: 'id,modifiedTime'
		});
		pokebookFolderId = response.data.id;
		pokebookFolderModifiedTime = response.data.modifiedTime;
	}
	return json({ folderId: pokebookFolderId, modifiedTime: pokebookFolderModifiedTime });
};
