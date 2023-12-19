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

import { google } from 'googleapis';

import googleClient from '$lib/client/GoogleOAuthClient';

export const GET: RequestHandler = async ({ setHeaders, request, url }) => {
	setHeaders({
		'cache-control': 'max-age=3600' // seconds
	});

	googleClient.setCredentials({ access_token: request.headers.get('Authorization') });

	const drive = google.drive('v3');

	try {
		const response = await drive.files.list({
			q: `'${url.searchParams.get(
				'pokebookFolderId'
			)}' in parents and trashed=false and not name contains '_note'`,
			orderBy: 'createdTime desc',
			auth: googleClient,
			fields: 'nextPageToken,files(id,name,createdTime,properties)'
		});
		return json(response.data.files);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		return new Response(e.errors, { status: e.status });
	}
};
