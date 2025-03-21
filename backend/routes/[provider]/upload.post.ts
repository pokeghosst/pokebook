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
import { findManifest, readManifest, uploadPoem } from '~/lib/client/google-drive';

export default defineEventHandler(async (event) => {
	const session = JSON.parse(getCookie(event, 'pokebook-session'));

	const { accessToken, expiresAt, sessionId } = session;

	const poems = JSON.parse(await readBody(event));

	// This is Ugly but fucking google makes it really not fucking clear how to make batch requests
	poems.forEach(async (poem) => {
		await makeAuthenticatedRequest({
			accessToken,
			expiresAt,
			sessionId,
			requestFn: uploadPoem,
			requestParams: [poem.name, poem.contents]
		});
	});
});
