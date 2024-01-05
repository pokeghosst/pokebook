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
import { XMLBuilder } from 'fast-xml-parser';

import googleClient from '$lib/client/GoogleOAuthClient';

import type { PoemEntity } from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	const poemId = params.id;

	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	googleClient.setCredentials({ access_token: accessToken });

	try {
		return json(
			(
				await google.drive('v3').files.get({
					fileId: poemId,
					alt: 'media',
					auth: googleClient
				})
			).data
		);
	} catch (e) {
		return new Response('', { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const poemId = params.id;

	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	googleClient.setCredentials({ access_token: accessToken });

	const poem = (await request.json()) as PoemEntity;

	try {
		await google.drive('v3').files.update({
			auth: googleClient,
			fileId: poemId,
			requestBody: {
				name: `${poem.name}.xml`
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

export const DELETE: RequestHandler = async ({ request, params }) => {
	const poemId = params.id;

	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');

	if (!accessToken) return new Response('', { status: 401 });

	googleClient.setCredentials({ access_token: accessToken });

	try {
		await google.drive('v3').files.delete({
			auth: googleClient,
			fileId: poemId
		});

		return new Response('', { status: 200 });
	} catch (e) {
		return new Response('', { status: 500 });
	}
};
