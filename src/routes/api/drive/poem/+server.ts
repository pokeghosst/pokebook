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

import { json, type RequestHandler } from '@sveltejs/kit';

import { google } from 'googleapis';

import googleClient from '$lib/util/GoogleOAuthClient';

import type { Poem } from '$lib/types/Poem';

export const GET: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');
	const noteId = url.searchParams.get('noteId');

	if (poemId === null) return new Response('Missing parameter `poemId`', { status: 400 });
	if (noteId === null) return new Response('Missing parameter `noteId`', { status: 400 });

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
};

export const POST: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const pokebookFolderId = url.searchParams.get('pokebookFolderId');
	const poem = (await request.json()) as Poem;

	if (pokebookFolderId === null)
		return new Response('Missing `pokebookFolderId` parameter', { status: 400 });

	const drive = google.drive({
		version: 'v3'
	});

	console.log(poem.note);

	const noteId = (
		await drive.files.create({
			auth: googleClient,
			requestBody: {
				name: `${poem.poem.name}_note`,
				parents: [pokebookFolderId]
			},
			media: {
				mimeType: 'text/plain',
				body: poem.note
			}
		})
	).data.id;

	if (noteId === null || noteId === undefined) return new Response('', { status: 500 });

	drive.files.create({
		auth: googleClient,
		requestBody: {
			name: poem.poem.name,
			parents: [pokebookFolderId],
			properties: {
				note_id: noteId
			}
		},
		media: {
			mimeType: 'text/plain',
			body: poem.poem.body
		}
	});

	return new Response('', { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');
	const noteId = url.searchParams.get('noteId');
	const poem = (await request.json()) as Poem;

	if (poemId === null) return new Response('Missing parameter `poemId`', { status: 400 });
	if (noteId === null) return new Response('Missing parameter `noteId`', { status: 400 });

	const drive = google.drive({
		version: 'v3'
	});

	drive.files.update({
		auth: googleClient,
		fileId: poemId,
		requestBody: {
			name: poem.poem.name
		},
		media: {
			mimeType: 'text/plain',
			body: poem.poem.body
		}
	});

	drive.files.update({
		auth: googleClient,
		fileId: noteId,
		media: {
			mimeType: 'text/plain',
			body: poem.note
		}
	});

	return new Response('', { status: 200 });
};
