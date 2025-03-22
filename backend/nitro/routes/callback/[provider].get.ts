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

import { processCallback } from '~/lib/client/google-auth';

export default defineEventHandler(async (event) => {
	const provider = getRouterParam(event, 'provider');
	const query = getQuery(event);

	// console.log(query, provider);

	if (query.error) {
		// TODO: Handle error
	}

	if (query.code && typeof query.code === 'string') {
		switch (provider) {
			case 'google':
				try {
					setCookie(event, 'pokebook-session', JSON.stringify(await processCallback(query.code)), {
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						maxAge: 60 * 60 * 24 * 30,
						path: '/'
					});

					return sendRedirect(event, `${useRuntimeConfig().clientUrl}?auth=success`, 302);
				} catch (err) {
					if (err.response?.data?.error === 'invalid_grant') {
						return sendRedirect(event, `${useRuntimeConfig().clientUrl}?auth=invalid_grant`, 302);
					} else {
						return sendRedirect(event, `${useRuntimeConfig().clientUrl}?auth=unknown`, 302);
					}
				}
			case 'dropbox':
		}
	}

	return {};
});
