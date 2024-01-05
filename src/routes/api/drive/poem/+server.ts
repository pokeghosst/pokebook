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
import { XMLBuilder } from 'fast-xml-parser';

import googleClient from '$lib/client/GoogleOAuthClient';

import type { PoemEntity } from '$lib/types';

const CACHE_MAX_AGE_SECONDS = 3600;

export const GET: RequestHandler = async ({ setHeaders, request, url }) => {
	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	googleClient.setCredentials({ access_token: accessToken });

	try {
		const response = await google.drive('v3').files.list({
			q: `'${url.searchParams.get('pokebookFolderId')}' in parents and trashed=false`,
			orderBy: 'createdTime desc',
			auth: googleClient,
			fields: 'nextPageToken,files(id,name,createdTime,properties)'
		});
		setHeaders({
			'cache-control': `max-age=${CACHE_MAX_AGE_SECONDS}`
		});
		return json(response.data.files);
	} catch (e) {
		return new Response('', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, url }) => {
	const accessToken = request.headers.get('Authorization');
	if (!accessToken) return new Response('', { status: 401 });

	const pokebookFolderId = url.searchParams.get('pokebookFolderId');
	if (!pokebookFolderId) return new Response('', { status: 400 });

	googleClient.setCredentials({ access_token: accessToken });

	const poem = (await request.json()) as PoemEntity;

	try {
		await google.drive('v3').files.create({
			auth: googleClient,
			requestBody: {
				name: `${poem.name}.xml`,
				parents: [pokebookFolderId]
			},
			media: {
				mimeType: 'text/xml',
				body: new XMLBuilder({ format: true }).build(poem)
			}
		});

		return new Response('', { status: 200 });
	} catch (e) {
		return new Response('', { status: 500 });
	}
};
