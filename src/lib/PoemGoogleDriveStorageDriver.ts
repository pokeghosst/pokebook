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
import { error } from '@sveltejs/kit';

let accessToken: string;
let accessTokenExpiration: string;

async function getAuthCredentials() {
	accessToken = (await Preferences.get({ key: 'google_access_token' })).value || '';
	accessTokenExpiration =
		(await Preferences.get({ key: 'google_access_token_expiration' })).value || '';
	if (
		accessToken == '' ||
		accessTokenExpiration == '' ||
		parseInt(accessTokenExpiration) < Date.now()
	) {
		console.log('getting new token...');
	}
}

async function retrievePokebookFolderMetadata() {

	let pokeBookFolderId = (await Preferences.get({ key: 'pokebook_folder_id' })).value || '';
	let pokebookFolderModifiedTime = (await Preferences.get({ key: 'pokebook_folder_modified_time' }))
		.value || '';

	if (
		pokeBookFolderId == null ||
		pokeBookFolderId === '' ||
		pokebookFolderModifiedTime == null ||
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
				Preferences.set({ key: 'pokebook_folder_id', value: pokeBookFolderId });
				Preferences.set({
					key: 'pokebook_folder_modified_time',
					value: pokebookFolderModifiedTime
				});
			})
		);
	}
	return { pokeBookFolderId , pokebookFolderModifiedTime };
}

function getNewAuthToken(): { token: string; expiration: string } {
	const token = 'NEW_TOKEN';
	const expiration = 'NEW_EXPIRATION';
	return { token, expiration };
}

export const PoemGoogleDriveStorageDriver: IPoemStorageDriver = {
	listPoems: async function (): Promise<PoemFile[]> {
		
		await getAuthCredentials();

		let { pokeBookFolderId, pokebookFolderModifiedTime } = await retrievePokebookFolderMetadata();

		// Even if PokeBook folder ID is present, we still need to get the latest modified date
		// Maybe some cache invalidation method or even force refresh button would be better
		// but considering the multi-platform nature of PokeBook, it's the best approach I see now.

		const response = await fetch(
			`/api/drive/folder/modified?pokebookFolderId=${pokeBookFolderId}`,
			{
				headers: {
					Authorization: accessToken
				}
			}
		);
		const pokebookFolderModifiedTimeLatest = await response.json();
		// Now that we have everything we need, a final check.
		// If the latest modified time is bigger than the stored one, read the list and update the stored time
		// Otherwise, just serve a cached list
		if (
			new Date(pokebookFolderModifiedTimeLatest) > new Date(pokebookFolderModifiedTime) ||
			localStorage.getItem('cachedGDrivePoemList') == null ||
			localStorage.getItem('cachedGDrivePoemList') === ''
		) {
			Preferences.set({
				key: 'pokebook_folder_modified_time',
				value: pokebookFolderModifiedTimeLatest
			});

			const driveListResponse = await fetch(
				`/api/drive/list?pokebookFolderId=${pokeBookFolderId}`,
				{
					headers: {
						Authorization: accessToken
					}
				}
			);

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

			cachePoemListToLocalStorage(poemFiles);

			return poemFiles;
		} else {
			return retrieveCachedPoemList();
		}
	},
	loadPoem: async function (poemFile: PoemFile): Promise<Poem> {
		await getAuthCredentials();

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
	},
	savePoem: function (poem: Poem): void {
		throw new Error('Function not implemented.');
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
