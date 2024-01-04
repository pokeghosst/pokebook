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

import { dbxAuthClient } from '$lib/client/DBXClient';

import { CredentialCacher } from '$lib/cache/CredentialsCacher';
import { RedisStorageKey } from '$lib/constants/RedisStorageKey';

export const GET: RequestHandler = async ({ request }) => {
	const refreshTokenId = request.headers.get('Authorization');

	if (refreshTokenId === null) return new Response('', { status: 401 });

	const refreshToken = await CredentialCacher.retrieveCredential(
		RedisStorageKey.DBX,
		refreshTokenId
	);

	if (refreshToken === undefined) return new Response('', { status: 500 });

	dbxAuthClient.setRefreshToken(refreshToken)
    dbxAuthClient.refreshAccessToken();

	const accessToken = dbxAuthClient.getAccessToken();
	const accessTokenExpiry = dbxAuthClient.getAccessTokenExpiresAt();

	return json({
		accessToken: accessToken,
		accessTokenExpiry: accessTokenExpiry
	});
};
