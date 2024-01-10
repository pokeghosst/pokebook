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

export const POST: RequestHandler = async ({ request, params }) => {
	const provider = params.provider;
	if (!provider) return new Response('', { status: 400 });

	const code = request.headers.get('Authorization');
	if (!code) return new Response('', { status: 401 });

	switch (provider) {
		case StorageProvider.DROPBOX:
			return json(await DropboxClient.processCallback(code));
		case StorageProvider.GOOGLE: {
			return json(await GoogleDriveClient.processCallback(code));
		}
		default:
			return new Response('', { status: 400 });
	}
};
