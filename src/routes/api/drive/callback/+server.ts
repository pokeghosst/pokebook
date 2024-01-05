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

import RIPEMD160 from 'crypto-js/ripemd160';

import googleClient from '$lib/client/GoogleOAuthClient';
import { CredentialCacher } from '$lib/cache/CredentialsCacher';

import { StorageProvider } from '$lib/enums/StorageProvider';

export const POST: RequestHandler = async ({ request }) => {
	const code = request.headers.get('Authorization');

	if (!code) return new Response('', { status: 401 });

	try {
		const { tokens } = await googleClient.getToken(code);
		let refreshTokenId;

		if (tokens.refresh_token !== undefined && tokens.refresh_token !== null) {
			refreshTokenId = RIPEMD160(tokens.refresh_token).toString();
			CredentialCacher.cacheCredential(
				StorageProvider.GOOGLE,
				refreshTokenId,
				tokens.refresh_token
			);
		}

		googleClient.setCredentials(tokens);

		return json({
			accessToken: tokens.access_token,
			expiration: tokens.expiry_date,
			refreshTokenId: refreshTokenId
		});
	} catch (e) {
		return new Response('', { status: 500 });
	}
};
