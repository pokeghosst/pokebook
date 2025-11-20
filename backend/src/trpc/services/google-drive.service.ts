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
import * as Y from 'yjs';

import { PoemRecord } from '@pokebook/shared';
import { OAuth2Client } from 'google-auth-library';

export const FILE_NAME_TIMESTAMP_DIVIDER = '@';

// Storage format for documents
interface StoredDocument {
	documentId: string;
	syncState: string;
	stateVector: string;
	syncStateHash: string;
	metadata: {
		name: string;
		snippet: string;
		createdAt: number;
		updatedAt: number;
	};
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

export async function list(client: OAuth2Client) {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const response = await google.drive('v3').files.list({
		q: `'${pokeBookFolderId}' in parents and trashed=false`,
		auth: client,
		fields: 'nextPageToken,files(id,name)'
	});

	return response.data.files;
}

export async function download(client: OAuth2Client, id: string) {
	const response = await google.drive('v3').files.get({
		fileId: id,
		alt: 'media',
		auth: client
	});

	const contents = response.data;

	return { fileId: id, contents: contents };
}

export async function upload(client: OAuth2Client, fileName: string, record: PoemRecord) {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const result = await google.drive('v3').files.create({
		auth: client,
		requestBody: {
			name: `${fileName}${FILE_NAME_TIMESTAMP_DIVIDER}${record.syncStateHash}`,
			parents: [pokeBookFolderId]
		},
		media: {
			mimeType: 'application/json',
			body: JSON.stringify(record)
		}
	});

	const fileId = result.data.id;

	if (!fileId) throw new Error('File has no ID');

	return { fileName, fileId };
}

export async function update(client: OAuth2Client, fileId: string, record: PoemRecord) {
	const result = await google.drive('v3').files.update({
		auth: client,
		fileId,
		requestBody: {
			name: `${record.id}${FILE_NAME_TIMESTAMP_DIVIDER}${record.syncStateHash}`
		},
		media: {
			mimeType: 'application/json',
			body: JSON.stringify(record)
		}
	});

	console.log(result);
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

export async function listWithVectors(client: OAuth2Client) {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const response = await google.drive('v3').files.list({
		q: `'${pokeBookFolderId}' in parents and trashed=false`,
		auth: client,
		fields: 'nextPageToken,files(id)'
	});

	const files = response.data.files || [];

	const results = await Promise.all(
		files.map(async (file) => {
			if (!file.id) return [];

			const doc = await download(client, file.id);
			const storedDoc = doc.contents as StoredDocument;

			return [{
				fileId: file.id,
				...storedDoc
			}];
		})
	);

	return results.flat();
}

export async function createDocument(
	client: OAuth2Client,
	documentId: string,
	initialState: string,
	stateVector: string,
	syncStateHash: string,
	metadata: StoredDocument['metadata']
): Promise<string> {
	const pokeBookFolderId = await getOrCreatePokeBookFolderId(client);

	const storedDoc: StoredDocument = {
		documentId,
		syncState: initialState,
		stateVector,
		syncStateHash,
		metadata
	};

	const result = await google.drive('v3').files.create({
		auth: client,
		requestBody: {
			name: `${documentId}${FILE_NAME_TIMESTAMP_DIVIDER}${syncStateHash}`,
			parents: [pokeBookFolderId]
		},
		media: {
			mimeType: 'application/json',
			body: JSON.stringify(storedDoc)
		}
	});

	const fileId = result.data.id;
	if (!fileId) throw new Error('File has no ID');

	return fileId;
}

export async function applyUpdateToDocument(
	client: OAuth2Client,
	fileId: string,
	documentId: string,
	update: string,
	newVector: string,
	newSyncStateHash: string
): Promise<void> {
	// Download current document
	const current = await download(client, fileId);
	const storedDoc = current.contents as StoredDocument;

	// Apply the update to get new full state
	const yDoc = new Y.Doc();
	const stateBuffer = Buffer.from(storedDoc.syncState, 'base64');
	Y.applyUpdate(yDoc, stateBuffer);

	const updateBuffer = Buffer.from(update, 'base64');
	Y.applyUpdate(yDoc, updateBuffer);

	const newState = Buffer.from(Y.encodeStateAsUpdate(yDoc)).toString('base64');

	const updatedDoc: StoredDocument = {
		...storedDoc,
		syncState: newState,
		stateVector: newVector,
		syncStateHash: newSyncStateHash,
		metadata: {
			...storedDoc.metadata,
			updatedAt: Date.now()
		}
	};

	// Update file
	await google.drive('v3').files.update({
		auth: client,
		fileId,
		requestBody: {
			name: `${documentId}${FILE_NAME_TIMESTAMP_DIVIDER}${newSyncStateHash}`
		},
		media: {
			mimeType: 'application/json',
			body: JSON.stringify(updatedDoc)
		}
	});
}

export async function computeDiffForClient(
	client: OAuth2Client,
	fileId: string,
	clientStateVector: string
): Promise<{ update: string; newVector: string }> {
	const current = await download(client, fileId);
	const storedDoc = current.contents as StoredDocument;

	// Reconstruct Y.Doc from stored state
	const yDoc = new Y.Doc();
	const stateBuffer = Buffer.from(storedDoc.syncState, 'base64');
	Y.applyUpdate(yDoc, stateBuffer);

	// Compute diff based on client's state vector
	const clientVectorBuffer = Buffer.from(clientStateVector, 'base64');
	const diffUpdate = Y.encodeStateAsUpdate(yDoc, clientVectorBuffer);

	return {
		update: Buffer.from(diffUpdate).toString('base64'),
		newVector: storedDoc.stateVector
	};
}

