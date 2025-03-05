/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024-2025 Pokeghost.

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

import { getGoogleAuthUrl } from '~/lib/client/google-auth';
import { DropboxClient } from '../../lib/client/DropboxClient';
import { GoogleDriveClient } from '../../lib/client/GoogleDriveClient';

import { StorageProvider } from '../../lib/enums/StorageProvider';

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, 'provider');

	try {
		switch (provider) {
			case StorageProvider.DROPBOX: {
				return new Response(await DropboxClient.getAuthUrl());
			}
			case StorageProvider.GOOGLE: {
				const authUrl = getGoogleAuthUrl();
				// return useRuntimeConfig().serverUrl;
				return sendRedirect(event, authUrl, 302);
			}
			default:
				return new Response('', { status: 400 });
		}
	} catch (e) {
		return new Response('', { status: 500 });
	}
});
