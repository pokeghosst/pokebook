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

import type { drive_v3 } from 'googleapis';
import { Preferences } from '@capacitor/preferences';

import type { IPoemStorageDriver } from './IPoemStorageDriver';

import type { Poem } from '../types/Poem';
import type { PoemFile } from '../types/PoemFile';

async function getAuthCredentials() {
	const accessToken = (await Preferences.get({ key: 'google_access_token' })).value;
	const accessTokenExpiration = (await Preferences.get({ key: 'google_access_token_expiration' }))
		.value;

	if (
		accessToken === null ||
		accessTokenExpiration === null ||
		parseInt(accessTokenExpiration) < Date.now()
	) {
		const { token, expiration } = await getNewAuthToken();
		Preferences.set({ key: 'google_access_token', value: token });
		Preferences.set({ key: 'google_access_token_expiration', value: expiration });
		return token;
	} else {
		return accessToken;
	}
}

async function getNewAuthToken(): Promise<{ token: string; expiration: string }> {
	const refreshTokenId = (await Preferences.get({ key: 'google_refresh_token_id' })).value;

	if (refreshTokenId === null) throw new Error('errors.google.efreshToken');

	const res = await fetch('/api/drive/auth/refresh', {
		headers: {
			Authorization: refreshTokenId
		}
	});

	const resJson = await res.json();

	const token = resJson.accessToken;
	const expiration = resJson.expiration;

	return { token, expiration };
}

async function retrievePokebookFolderId() {
	const pokeBookFolderId = (await Preferences.get({ key: 'google_pokebook_folder_id' })).value;
	const accessToken = await getAuthCredentials();

	if (pokeBookFolderId === null) {
		const folderIdResponse = await fetch('/api/drive/folder', {
			headers: {
				Authorization: accessToken
			}
		});
		const folderId = (await folderIdResponse.json()).folderId as string;

		if (folderId === undefined) throw new Error('errors.google.folderId');

		Preferences.set({ key: 'google_pokebook_folder_id', value: folderId });
		return folderId;
	} else {
		return pokeBookFolderId;
	}
}

export async function googleDriveLogout() {
	const accessToken = await getAuthCredentials();

	await fetch('/api/drive/logout', {
		headers: {
			Authorization: accessToken
		},
		method: 'GET'
	});
	Preferences.remove({ key: 'google_access_token' });
	Preferences.remove({ key: 'google_access_token_expiration' });
	Preferences.remove({ key: 'google_refresh_token_id' });
	Preferences.remove({ key: 'google_pokebook_folder_id' });
}

export const PoemGoogleDriveStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		const accessToken = await getAuthCredentials();
		const pokeBookFolderId = await retrievePokebookFolderId();

		let requestId = (await Preferences.get({ key: 'poem_list_request_timestamp' })).value;

		if (requestId === null) {
			requestId = Date.now().toString();
			Preferences.set({ key: 'poem_list_request_timestamp', value: requestId });
		}

		const driveListResponse = await fetch(
			`/api/drive/list?pokebookFolderId=${pokeBookFolderId}&cache=${requestId}`,
			{
				headers: {
					Authorization: accessToken
				}
			}
		);

		if (driveListResponse.status === 404) throw new Error('errors.google.poemList')
		if (driveListResponse.status === 500) throw new Error('errors.unknown')

		const storedFiles = (await driveListResponse.json()) as drive_v3.Schema$File[];
		const poemFiles: PoemFile[] = [];

		storedFiles.forEach((file) => {
			if (
				file.name != null &&
				file.id != null &&
				file.createdTime != null &&
				file.properties != null
			) {
				poemFiles.push({
					name: file.name.split('_')[0],
					poemUri: file.id,
					noteUri: file.properties.note_id,
					timestamp: file.createdTime
				});
			}
		});

		return poemFiles;
	},
	loadPoem: async function (poemFile: PoemFile) {
		const accessToken = await getAuthCredentials();

		const response = await fetch(
			`/api/drive/poem?poemId=${poemFile.poemUri}&noteId=${poemFile.noteUri}`,
			{
				headers: {
					Authorization: accessToken
				}
			}
		);
		const responseJson = await response.json();
		return {
			poem: {
				name: poemFile.name,
				body: responseJson.poem
			},
			// If the note is empty, it's returned as {} and cannot be treated as a string
			note: typeof responseJson.note === 'object' ? '' : responseJson.note
		};
	},
	savePoem: async function (poem: Poem) {
		const accessToken = await getAuthCredentials();
		const pokeBookFolderId = await retrievePokebookFolderId();

		await fetch(`/api/drive/poem?pokebookFolderId=${pokeBookFolderId}`, {
			method: 'POST',
			headers: {
				Authorization: accessToken,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	updatePoem: async function (poem: Poem, poemUri: string, noteUri: string) {
		const accessToken = await getAuthCredentials();

		await fetch(`/api/drive/poem?poemId=${poemUri}&noteId=${noteUri}`, {
			method: 'PATCH',
			headers: {
				Authorization: accessToken,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(poem)
		});
		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	deletePoem: async function (poemUri: string, noteUri: string) {
		const accessToken = await getAuthCredentials();

		await fetch(`/api/drive/poem?poemId=${poemUri}&noteId=${noteUri}`, {
			method: 'DELETE',
			headers: {
				Authorization: accessToken
			}
		});
		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	}
};
