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
import type { drive_v3 } from 'googleapis';

export async function findManifest(client: OAuth2Client): Promise<drive_v3.Schema$File[]> {
	// console.log(client);

	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const response = await google.drive('v3').files.list({
		q: `'${pokeBookFolderId}' in parents and trashed=false and name='.pokemanifest'`,
		orderBy: 'createdTime desc',
		auth: client,
		fields: 'nextPageToken,files(id,name,createdTime,properties)'
	});

	return response.data.files;
}

export async function readManifest(client: OAuth2Client, manifestId: string): Promise<string> {
	const manifestResponse = await google.drive('v3').files.get({
		fileId: manifestId,
		alt: 'media',
		auth: client
	});
	return manifestResponse.data.toString();
}

export async function createManifest(client: OAuth2Client, manifest: string): Promise<string> {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const response = await google.drive('v3').files.create({
		auth: client,
		requestBody: {
			name: '.pokemanifest',
			parents: [pokeBookFolderId]
		},
		media: {
			mimeType: 'text/xml',
			body: manifest
		}
	});

	return response.data.id;
}

export async function getOrCreatePokeBookFolderId(client: OAuth2Client): Promise<string> {
	const drive = google.drive('v3');

	const results = await drive.files.list({
		q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${
			useRuntimeConfig().pokebookFolderName
		}'`,
		fields: 'files(id)',
		auth: client
	});

	if (results.data.files && results.data.files.length > 0) {
		return results.data.files[0].id;
	} else {
		console.log('pokebook folder not found');
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
