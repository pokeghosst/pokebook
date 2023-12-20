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

import { PUBLIC_POKEBOOK_BASE_URL } from '$env/static/public';
import { dbxAuthClient, dbxClient } from '$lib/client/DBXClient';
import { json, type RequestHandler } from '@sveltejs/kit';
import { Dropbox } from 'dropbox';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (code) {
		const { result } = await dbxAuthClient.getAccessTokenFromCode(
			`${PUBLIC_POKEBOOK_BASE_URL}/api/dropbox/callback`,
			code
		);
		console.log(result);
		dbxAuthClient.setAccessToken(result.access_token);
		console.log(await new Dropbox({ accessToken: result.access_token }).usersGetCurrentAccount());
	}
	return json('');
};
