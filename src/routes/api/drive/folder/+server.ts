/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/client/GoogleOAuthClient';

import { PUBLIC_POKEBOOK_FOLDER_NAME } from '$env/static/public';

export const GET: RequestHandler = async ({ request }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	googleClient.setCredentials({ access_token: accessToken });

	let pokebookFolderId;

	const drive = google.drive('v3');
	const results = await drive.files.list({
		q: `mimeType='application/vnd.google-apps.folder' and name='${PUBLIC_POKEBOOK_FOLDER_NAME}'`,
		fields: 'files(id)',
		auth: googleClient
	});

	if (results.data.files && results.data.files.length > 0) {
		pokebookFolderId = results.data.files[0].id;
	} else {
		const response = await drive.files.create({
			requestBody: {
				name: PUBLIC_POKEBOOK_FOLDER_NAME,
				mimeType: 'application/vnd.google-apps.folder'
			},
			fields: 'id',
			auth: googleClient
		});
		pokebookFolderId = response.data.id;
	}
	return json({ folderId: pokebookFolderId });
};
