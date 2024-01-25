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

import { Preferences } from '@capacitor/preferences';
import { XMLParser } from 'fast-xml-parser';

import { retrieveAccessToken, refreshAndReturnAccessToken } from './StorageProviderUtil';

import type { PoemEntity, PoemFileEntity } from '$lib/types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';
import { StorageProvider } from '$lib/enums/StorageProvider';

import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';

async function getAccessToken() {
	return (
		(await retrieveAccessToken(StorageProvider.DROPBOX)) ||
		(await refreshAndReturnAccessToken(StorageProvider.DROPBOX))
	);
}

export async function getDropboxAuthUrl() {
	const response = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/auth`);
	return await response.json();
}

export async function dropboxLogout() {
	const refreshTokenId = (await Preferences.get({ key: 'dropbox_refresh_token_id' })).value;

	if (refreshTokenId)
		await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/auth`, {
			method: 'DELETE',
			headers: {
				Authorization: refreshTokenId
			}
		});

	Preferences.remove({ key: 'dropbox_refresh_token_id' });
	Preferences.remove({ key: 'dropbox_access_token' });
	Preferences.remove({ key: 'dropbox_access_token_expiration' });
}

export const PoemDropboxStorageDriver: IPoemStorageDriver = {
	listPoems: async function (): Promise<PoemFileEntity[]> {
		let requestId = (await Preferences.get({ key: 'poem_list_request_timestamp' })).value;

		if (requestId === null) {
			requestId = Date.now().toString();
			Preferences.set({ key: 'poem_list_request_timestamp', value: requestId });
		}

		const response = await fetch(
			`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/poem?cache=${requestId}`,
			{
				headers: {
					Authorization: await getAccessToken()
				}
			}
		);

		if (response.status !== 200)
			switch (response.status) {
				case 401:
					throw new Error('errors.authTokenExpired');
				default:
					throw new Error('errors.unknown');
			}

		return await response.json();
	},
	loadPoem: async function (poemUri: string): Promise<PoemEntity> {
		const response = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/poem/${poemUri}`, {
			headers: {
				Authorization: await getAccessToken()
			}
		});

		if (response.status !== 200) throw new Error('errors.unknown');

		return new XMLParser().parse(await response.json());
	},
	savePoem: async function (poem: PoemEntity): Promise<void> {
		await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/poem`, {
			method: 'POST',
			headers: {
				Authorization: await getAccessToken(),
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	updatePoem: async function (poem: PoemEntity, poemUri: string) {
		await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/poem/${poemUri}`, {
			method: 'PATCH',
			headers: {
				Authorization: await getAccessToken()
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	deletePoem: async function (poemUri: string) {
		await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/api/dropbox/poem/${poemUri}`, {
			method: 'DELETE',
			headers: {
				Authorization: await getAccessToken()
			}
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	}
};
