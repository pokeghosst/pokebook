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

import { StorageProvider } from '$lib/enums/StorageProvider';
import { DropboxClient } from '$lib/client/DropboxClient';
import { GoogleDriveClient } from '$lib/client/GoogleDriveClient';

export const GET: RequestHandler = async ({ params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	try {
		switch (provider) {
			case StorageProvider.DROPBOX:
				return json('hello from dropbox');
			// return json(await DropboxClient.getAuthUrl());
			case StorageProvider.GOOGLE: {
				return json('hello from google drive');
				// return json(await GoogleDriveClient.getAuthUrl());
			}
			default:
				return new Response('', { status: 400 });
		}
	} catch (e) {
		return new Response('', { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	const refreshTokenId = request.headers.get('Authorization');
	if (!refreshTokenId) return new Response('', { status: 401 });

	try {
		switch (provider) {
			case StorageProvider.DROPBOX:
				return json(await DropboxClient.revokeTokenAndLogOut(refreshTokenId));
			case StorageProvider.GOOGLE: {
				return json(await GoogleDriveClient.revokeTokenAndLogOut(refreshTokenId));
			}
			default:
				return new Response('', { status: 400 });
		}
	} catch (e) {
		return new Response('', { status: 500 });
	}
};
