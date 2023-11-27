import { error, json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

export const GET: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');
	const noteId = url.searchParams.get('noteId');

	if (poemId != null && noteId != null) {
		const drive = google.drive({
			version: 'v3'
		});
		const poemFileResponse = await drive.files.get({
			fileId: poemId,
			alt: 'media',
			auth: googleClient
		});
		const noteFileResponse = await drive.files.get({
			fileId: noteId,
			alt: 'media',
			auth: googleClient
		});
		return json({
			poem: poemFileResponse.data,
			note: noteFileResponse.data
		});
	} else {
		throw error(400, {
			message: 'PokeBook folder ID missing'
		});
	}
};
