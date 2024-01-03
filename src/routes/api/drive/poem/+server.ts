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

import type { Poem } from '$lib/models/Poem';
import { XMLBuilder } from 'fast-xml-parser';

export const GET: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');

	if (poemId === null) return new Response('Missing parameter `poemId`', { status: 400 });

	const drive = google.drive({
		version: 'v3'
	});

	try {
		const poemFileResponse = await drive.files.get({
			fileId: poemId,
			alt: 'media',
			auth: googleClient
		});

		return json(poemFileResponse.data);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		return new Response(e.errors, { status: e.response.status });
	}
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

	await drive.files.create({
		auth: googleClient,
		requestBody: {
			name: `${poem.name}.xml`,
			parents: [pokebookFolderId]
		},
		media: {
			mimeType: 'text/plain',
			body: new XMLBuilder({ format: true }).build(poem)
		}
	});

	return new Response('', { status: 200 });
};

export const PATCH: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');
	const poem = (await request.json()) as Poem;

	if (poemId === null) return new Response('Missing parameter `poemId`', { status: 400 });

	const drive = google.drive({
		version: 'v3'
	});

	await drive.files.update({
		auth: googleClient,
		fileId: poemId,
		requestBody: {
			name: `${poem.name}.xml`
		},
		media: {
			mimeType: 'text/plain',
			body: new XMLBuilder({ format: true }).build(poem)
		}
	});

	return new Response('', { status: 200 });
};

export const DELETE: RequestHandler = async ({ request, url }) => {
	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const poemId = url.searchParams.get('poemId');

	if (poemId === null) return new Response('Missing parameter `poemId`', { status: 400 });

	const drive = google.drive({
		version: 'v3'
	});

	await drive.files.delete({
		auth: googleClient,
		fileId: poemId
	});

	return new Response('', { status: 200 });
};
