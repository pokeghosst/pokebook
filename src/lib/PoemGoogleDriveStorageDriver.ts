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

import type { Poem } from './types/Poem';
import type { PoemFile } from './types/PoemFile';
import { cachePoemListToLocalStorage, retrieveCachedPoemList } from './util/GoogleDriveUtil';

async function getAuthCredentials() {
	let accessToken = (await Preferences.get({ key: 'google_access_token' })).value;
	let accessTokenExpiration = (await Preferences.get({ key: 'google_access_token_expiration' }))
		.value;

	if (
		accessToken === null ||
		accessToken === '' ||
		accessTokenExpiration === null ||
		accessTokenExpiration === '' ||
		parseInt(accessTokenExpiration) < Date.now()
	) {
		console.log('getting new token...');
		// TODO
	}

	return accessToken;
}

async function retrievePokebookFolderMetadata() {
	let pokeBookFolderId = (await Preferences.get({ key: 'pokebook_folder_id' })).value;
	let pokebookFolderModifiedTime = (await Preferences.get({ key: 'pokebook_folder_modified_time' }))
		.value;

	const accessToken = await getAuthCredentials();

	if (accessToken !== null && accessToken !== '') {
		if (
			pokeBookFolderId === null ||
			pokeBookFolderId === '' ||
			pokebookFolderModifiedTime === null ||
			pokebookFolderModifiedTime === ''
		) {
			fetch('/api/drive/folder', {
				headers: {
					Authorization: accessToken
				}
			}).then((response) =>
				response.json().then((json) => {
					pokeBookFolderId = json.folderId;
					pokebookFolderModifiedTime = json.modifiedTime;
					if (
						pokeBookFolderId !== null &&
						pokeBookFolderId !== '' &&
						pokebookFolderModifiedTime !== null &&
						pokebookFolderModifiedTime !== ''
					) {
						Preferences.set({ key: 'pokebook_folder_id', value: pokeBookFolderId });
						Preferences.set({
							key: 'pokebook_folder_modified_time',
							value: pokebookFolderModifiedTime
						});
					}
				})
			);
		}
	}
	return { pokeBookFolderId, pokebookFolderModifiedTime };
}

async function loadPoemList(accessToken: string, pokeBookFolderId: string) {
	const driveListResponse = await fetch(`/api/drive/list?pokebookFolderId=${pokeBookFolderId}`, {
		headers: {
			Authorization: accessToken
		}
	});

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
}

function getNewAuthToken(): { token: string; expiration: string } {
	const token = 'NEW_TOKEN';
	const expiration = 'NEW_EXPIRATION';
	return { token, expiration };
}

export const PoemGoogleDriveStorageDriver: IPoemStorageDriver = {
	listPoems: async function (): Promise<PoemFile[]> {
		const accessToken = await getAuthCredentials();
		const { pokeBookFolderId, pokebookFolderModifiedTime } = await retrievePokebookFolderMetadata();

		if (
			accessToken !== null &&
			accessToken !== '' &&
			pokeBookFolderId !== null &&
			pokeBookFolderId !== ''
		) {
			const response = await fetch(
				`/api/drive/folder/modified?pokebookFolderId=${pokeBookFolderId}`,
				{
					headers: {
						Authorization: accessToken
					}
				}
			);
			const pokebookFolderModifiedTimeLatest = (await response.json()) as string;

			if (
				pokebookFolderModifiedTime === null ||
				pokebookFolderModifiedTime === '' ||
				new Date(pokebookFolderModifiedTimeLatest) > new Date(pokebookFolderModifiedTime)
			) {
				Preferences.set({
					key: 'pokebook_folder_modified_time',
					value: pokebookFolderModifiedTimeLatest
				});

				const poemFiles = await loadPoemList(accessToken, pokeBookFolderId);
				cachePoemListToLocalStorage(poemFiles);

				return poemFiles;
			} else {
				const cachedPoems = await retrieveCachedPoemList();
				if (cachedPoems.length === 0) {
					const poemFiles = await loadPoemList(accessToken, pokeBookFolderId);
					cachePoemListToLocalStorage(poemFiles);

					return poemFiles;
				} else {
					return cachedPoems;
				}
			}
		} else {
			// TODO
			return [];
		}
	},
	loadPoem: async function (poemFile: PoemFile): Promise<Poem> {
		const accessToken = await getAuthCredentials();

		if (accessToken !== null && accessToken !== '') {
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
				note: responseJson.note
			};
		} else {
			throw new Error('Could not retrieve poem');
		}
	},
	savePoem: async function (poem: Poem): Promise<void> {
		const accessToken = await getAuthCredentials();
		const { pokeBookFolderId } = await retrievePokebookFolderMetadata();

		if (
			accessToken !== null &&
			accessToken !== '' &&
			pokeBookFolderId !== null &&
			pokeBookFolderId !== ''
		) {
			const date = new Date(Date.now());
			poem.poem.name = `${poem.poem.name}_${date.getFullYear()}-${
				date.getMonth() + 1
			}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
			const response = await fetch(`/api/drive/poem?pokebookFolderId=${pokeBookFolderId}`, {
				method: 'POST',
				headers: {
					Authorization: accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(poem)
			});
			const jsonResponse = await response.json();
			console.log(jsonResponse);
		} else {
			throw new Error('Could not retrieve auth credentials or PokeBook folder ID');
		}
	},
	updatePoem: function (
		poem: Poem,
		poemUri: string,
		noteUri: string
	): Promise<{ newPoemUri: string; newNoteUri: string }> {
		throw new Error('Function not implemented.');
	},
	deletePoem: function (poemUri: string, noteUri: string): void {
		throw new Error('Function not implemented.');
	}
};
