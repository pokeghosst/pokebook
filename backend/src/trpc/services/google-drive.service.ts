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

import { OAuth2Client } from 'google-auth-library';

export async function findManifest(client: OAuth2Client) {
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

export async function readManifest(client: OAuth2Client, manifestId: string) {
	const manifestResponse = await google.drive('v3').files.get({
		fileId: manifestId,
		alt: 'media',
		auth: client
	});
	return manifestResponse.data.toString();
}

export async function createManifest(client: OAuth2Client, manifest: string) {
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

export async function getOrCreatePokeBookFolderId(client: OAuth2Client) {
	const drive = google.drive('v3');

	const results = await drive.files.list({
		q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${process.env.POKEBOOK_FOLDER_NAME}'`,
		fields: 'files(id)',
		auth: client
	});

	if (results.data.files && results.data.files.length > 0) {
		const folderId = results.data.files[0].id;

		if (!folderId) throw new Error('Folder has no ID');

		return folderId;
	} else {
		return await createPokeBookFolder(client);
	}
}

export async function listPoems(client: OAuth2Client) {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const response = await google.drive('v3').files.list({
		q: `'${pokeBookFolderId}' in parents and trashed=false`,
		auth: client,
		fields: 'nextPageToken,files(id,name,createdTime)'
	});

	return response.data.files;
}

export async function downloadPoem(client: OAuth2Client, id: string) {
	console.log('downloading poems');

	const response = await google.drive('v3').files.get({
		fileId: id,
		alt: 'media',
		auth: client
	});

	const contents = response.data.toString();

	return { fileId: id, contents };
}

export async function uploadPoem(client: OAuth2Client, fileName: string, poemContents: string) {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const result = await google.drive('v3').files.create({
		auth: client,
		requestBody: {
			name: fileName,
			parents: [pokeBookFolderId]
		},
		media: {
			mimeType: 'text/xml',
			body: poemContents
		}
	});

	const fileId = result.data.id;

	if (!fileId) throw new Error('File has no ID');

	return { fileName, fileId };
}

async function createPokeBookFolder(client: OAuth2Client): Promise<string> {
	const response = await google.drive('v3').files.create({
		requestBody: {
			name: process.env.POKEBOOK_FOLDER_NAME,
			mimeType: 'application/vnd.google-apps.folder'
		},
		fields: 'id',
		auth: client
	});

	const folderId = response.data.id;

	if (!folderId) throw new Error('Folder has no ID');

	return folderId;
}
