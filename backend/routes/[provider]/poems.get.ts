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
import { listPoems } from '~/lib/client/google-drive';

export default defineEventHandler(async (event) => {
	const session = JSON.parse(getCookie(event, 'pokebook-session'));

	const { accessToken, expiresAt, sessionId } = session;

	if (!session || !sessionId) {
		throw createError({
			statusCode: 401,
			message: 'No session found'
		});
	}

	const result = await makeAuthenticatedRequest({
		accessToken,
		expiresAt,
		sessionId,
		requestFn: listPoems
	});

	if (result.tokenRefreshed && result.newToken) {
		setCookie(event, 'pokebook-session', JSON.stringify({ ...result.newToken, sessionId }), {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30,
			path: '/'
		});
	}

	return result.data;
});
