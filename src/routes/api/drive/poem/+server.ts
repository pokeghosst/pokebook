/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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

import { error, json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

import type { Poem } from '$lib/types/Poem';

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

export const POST: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const pokebookFolderId = url.searchParams.get('pokebookFolderId');
	const poem = (await request.json()) as Poem;

	if (pokebookFolderId !== null) {
		const drive = google.drive({
			version: 'v3'
		});
		const response = await drive.files.create({
			auth: googleClient,
			requestBody: {
				name: `${poem.poem.name}_note`,
				parents: [pokebookFolderId]
			},
			media: {
				mimeType: 'text/plain',
				body: poem.note
			}
		});
		const noteId = response.data.id;
		console.log(noteId);
	}

	return json(poem);
};
