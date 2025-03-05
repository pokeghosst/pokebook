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

import { google } from 'googleapis';

import type { OAuth2Client } from 'google-auth-library';

export async function getManifest(client: OAuth2Client) {
	// console.log(client);

	const pokeBookFolderId = await getPokeBookFolderId(client);

	const response = await google.drive('v3').files.list({
		q: `'${pokeBookFolderId}' in parents and trashed=false`,
		orderBy: 'createdTime desc',
		auth: client,
		fields: 'nextPageToken,files(id,name,createdTime,properties)'
	});

	console.log(response.data.files);
}

export async function getPokeBookFolderId(client: OAuth2Client): Promise<string> {
	const drive = google.drive('v3');

	const results = await drive.files.list({
		q: `mimeType='application/vnd.google-apps.folder' and name='${
			useRuntimeConfig().pokebookFolderName
		}'`,
		fields: 'files(id)',
		auth: client
	});

	if (results.data.files && results.data.files.length > 0) {
		return results.data.files[0].id;
	} else {
		return await createPokeBookFolder(client);
	}
}

async function createPokeBookFolder(client: OAuth2Client): Promise<string> {
	const response = await google.drive('v3').files.create({
		requestBody: {
			name: useRuntimeConfig().pokebookFolderName,
			mimeType: 'application/vnd.google-apps.folder'
		},
		fields: 'id',
		auth: client
	});
	return response.data.id;
}
