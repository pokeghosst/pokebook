/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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
import { XMLParser } from 'fast-xml-parser';

import type { IPoemStorageDriver } from './IPoemStorageDriver';

import type { PoemEntity, PoemFileEntity } from '$lib/types';
import { refreshAndReturnAccessToken, retrieveAccessToken } from './StorageProviderUtil';
import { StorageProvider } from '$lib/enums/StorageProvider';

async function getAccessToken() {
	return (
		(await retrieveAccessToken(StorageProvider.GOOGLE)) ||
		(await refreshAndReturnAccessToken(StorageProvider.GOOGLE))
	);
}

async function retrievePokebookFolderId() {
	const pokeBookFolderId = (await Preferences.get({ key: 'google_pokebook_folder_id' })).value;

	if (pokeBookFolderId === null) {
		const folderIdResponse = await fetch('/api/google/folder', {
			headers: {
				Authorization: await getAccessToken()
			}
		});
		const folderId = (await folderIdResponse.json()).pokebookFolderId as string;

		if (folderId === undefined) throw new Error('errors.google.folderId');

		Preferences.set({ key: 'google_pokebook_folder_id', value: folderId });
		return folderId;
	} else {
		return pokeBookFolderId;
	}
}

export async function getGoogleDriveAuthUrl() {
	const response = await fetch('/api/google/auth', {
		method: 'GET'
	});
	return await response.json();
}

export async function googleDriveLogout() {
	const accessToken = await retrieveAccessToken(StorageProvider.GOOGLE);
	if (accessToken) {
		await fetch('/api/google/auth', {
			method: 'DELETE',
			headers: {
				Authorization: accessToken
			}
		});
	}
	Preferences.remove({ key: 'google_access_token' });
	Preferences.remove({ key: 'google_access_token_expiration' });
	Preferences.remove({ key: 'google_refresh_token_id' });
	Preferences.remove({ key: 'google_pokebook_folder_id' });
}

export const PoemGoogleDriveStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		let requestId = (await Preferences.get({ key: 'poem_list_request_timestamp' })).value;

		if (requestId === null) {
			requestId = Date.now().toString();
			Preferences.set({ key: 'poem_list_request_timestamp', value: requestId });
		}

		const response = await fetch(
			`/api/google/poem?pokebookFolderId=${await retrievePokebookFolderId()}&cache=${requestId}`,
			{
				headers: {
					Authorization: await getAccessToken()
				}
			}
		);

		if (response.status !== 200)
			switch (response.status) {
				case 404:
				case 401:
					throw new Error('errors.google.poemList');
				default:
					throw new Error('errors.unknown');
			}

		const storedFiles = (await response.json()) as drive_v3.Schema$File[];
		const poemFiles: PoemFileEntity[] = [];

		storedFiles.forEach((file) => {
			if (file.name != null && file.id != null && file.createdTime != null) {
				poemFiles.push({
					name: file.name.split('.xml')[0],
					poemUri: file.id,
					timestamp: file.createdTime
				});
			}
		});

		return poemFiles;
	},
	loadPoem: async function (poemUri: string) {
		const response = await fetch(`/api/google/poem/${poemUri}`, {
			headers: {
				Authorization: await getAccessToken()
			}
		});

		if (response.status !== 200)
			switch (response.status) {
				case 404:
					throw new Error('errors.google.poemNotFound');
				default:
					throw new Error('errors.unknown');
			}

		return new XMLParser().parse(await response.json());
	},
	savePoem: async function (poem: PoemEntity) {
		await fetch(`/api/google/poem?pokebookFolderId=${await retrievePokebookFolderId()}`, {
			method: 'POST',
			headers: {
				Authorization: await getAccessToken(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	updatePoem: async function (poem: PoemEntity, poemUri: string) {
		await fetch(`/api/google/poem/${poemUri}`, {
			method: 'PATCH',
			headers: {
				Authorization: await getAccessToken(),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	deletePoem: async function (poemUri: string) {
		await fetch(`/api/google/poem/${poemUri}`, {
			method: 'DELETE',
			headers: {
				Authorization: await getAccessToken()
			}
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	}
};
