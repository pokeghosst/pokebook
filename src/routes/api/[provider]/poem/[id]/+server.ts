/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import { DropboxClient } from '$lib/client/DropboxClient';
import { GoogleDriveClient } from '$lib/client/GoogleDriveClient';

import { StorageProvider } from '$lib/enums/StorageProvider';

import type { PoemEntity } from '$lib/types';

export const GET: RequestHandler = async ({ request, params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	const poemId = params.id;
	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');
	if (!accessToken) return new Response('', { status: 401 });

	switch (provider) {
		case StorageProvider.DROPBOX:
			try {
				return json(await DropboxClient.getPoem(accessToken, poemId));
			} catch (e) {
				return new Response(null, { status: 500 });
			}
		case StorageProvider.GOOGLE: {
			return json(await GoogleDriveClient.getPoem(accessToken, poemId));
		}
		default:
			return new Response('', { status: 400 });
	}
};

export const PATCH: RequestHandler = async ({ request, params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	const poemId = params.id;
	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');
	if (!accessToken) return new Response('', { status: 401 });

	const poem = (await request.json()) as PoemEntity;

	switch (provider) {
		case StorageProvider.DROPBOX:
			return json(await DropboxClient.updatePoem(accessToken, poemId, poem));
		case StorageProvider.GOOGLE: {
			return json(await GoogleDriveClient.updatePoem(accessToken, poemId, poem));
		}
		default:
			return new Response('', { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	const poemId = params.id;
	if (!poemId) return new Response('', { status: 404 });

	const accessToken = request.headers.get('Authorization');
	if (!accessToken) return new Response('', { status: 401 });

	switch (provider) {
		case StorageProvider.DROPBOX:
			return json(await DropboxClient.deletePoem(accessToken, poemId));
		case StorageProvider.GOOGLE: {
			return json(await GoogleDriveClient.deletePoem(accessToken, poemId));
		}
		default:
			return new Response('', { status: 400 });
	}
};
