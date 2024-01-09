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

import RIPEMD160 from 'crypto-js/ripemd160';

import { dropboxAuthClient } from '$lib/client/DropboxClient';
import { CredentialCacher } from '$lib/cache/CredentialsCacher';

import { StorageProvider } from '$lib/enums/StorageProvider';

import { PUBLIC_POKEBOOK_BASE_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	const code = request.headers.get('Authorization');

	if (!code) return new Response('', { status: 401 });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { result }: any = await dropboxAuthClient.getAccessTokenFromCode(
		`${PUBLIC_POKEBOOK_BASE_URL}/callback/dropbox`,
		code
	);

	if (!result.refresh_token) return new Response('', { status: 500 });

	const refreshTokenId = RIPEMD160(result.refresh_token).toString();
	CredentialCacher.cacheCredential(StorageProvider.DROPBOX, refreshTokenId, result.refresh_token);

	return json({
		accessToken: result.access_token,
		expiration: Date.now() + parseInt(result.expires_in) * 1000,
		refreshTokenId: refreshTokenId
	});
};
