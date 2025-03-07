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
import { findManifest, readManifest } from '~/lib/client/google-drive';

export default defineEventHandler(async (event) => {
	// TODO: Refactor this into middleware
	const session = JSON.parse(getCookie(event, 'pokebook-session'));

	// console.log(session);

	const { accessToken, expiresAt, sessionId } = session;

	if (!session || !sessionId) {
		throw createError({
			statusCode: 401,
			message: 'No session found'
		});
	}

	try {
		const result = await makeAuthenticatedRequest({
			accessToken,
			expiresAt,
			sessionId,
			requestFn: findManifest
		});

		if (result.tokenRefreshed && result.newToken) {
			setCookie(event, 'pokebook-session', JSON.stringify({ ...result.newToken, sessionId }), {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 30,
				path: '/'
			});
		}

		if (result.data.length > 0) {
			const manifestFileId = result.data[0].id;

			const manifestReadResult = await makeAuthenticatedRequest({
				accessToken,
				expiresAt,
				sessionId,
				requestFn: readManifest,
				requestParams: [manifestFileId]
			});

			return {
				manifest: manifestReadResult.data
			};
		} else {
			return new Response('{}', { status: 404 });
		}
	} catch (err) {
		if (err.response.status === 401) {
			throw createError({
				statusCode: 401,
				message: "Couldn't authenticate"
			});
		}

		throw createError({
			statusCode: 500,
			message: "Couldn't access Google API"
		});
	}
});
