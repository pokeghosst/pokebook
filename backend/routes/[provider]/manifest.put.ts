/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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

import { makeAuthenticatedRequest } from '~/lib/client/google-auth';
import { createManifest } from '~/lib/client/google-drive';
import { StorageProvider } from '~/lib/enums/StorageProvider';

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, 'provider');
	const manifestContents = await readBody(event);

	const session = JSON.parse(getCookie(event, 'pokebook-session'));
	const { accessToken, expiresAt, sessionId } = session;

	switch (provider) {
		case StorageProvider.DROPBOX:
		case StorageProvider.GOOGLE: {
			const result = await makeAuthenticatedRequest({
				accessToken,
				expiresAt,
				sessionId,
				requestFn: createManifest,
				requestParams: [manifestContents]
			});

			console.log(result);
		}
		default:
			throw createError({
				statusCode: 400,
				message: 'No such provider'
			});
	}
});
