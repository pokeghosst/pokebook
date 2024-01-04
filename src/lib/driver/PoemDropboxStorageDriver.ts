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

import type { PoemEntity, PoemFileEntity } from '$lib/types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';
import { XMLParser } from 'fast-xml-parser';

export async function getDropboxAuthUrl() {
	const response = await fetch('/api/dropbox/auth', {
		method: 'GET'
	});
	return await response.json();
}

async function getAuthCredentials() {
	const accessToken = (await Preferences.get({ key: 'dropbox_access_token' })).value;
	const accessTokenExpiration = (await Preferences.get({ key: 'dropbox_access_token_expiration' }))
		.value;

	if (
		accessToken === null ||
		accessTokenExpiration === null ||
		parseInt(accessTokenExpiration) < Date.now()
	) {
		const { newAccessToken, newAccessTokenExpiry } = await getNewAuthToken();
		Preferences.set({ key: 'dropbox_access_token', value: newAccessToken });
		Preferences.set({ key: 'dropbox_access_token_expiration', value: newAccessTokenExpiry });
		return newAccessToken;
	} else {
		return accessToken;
	}
}

async function getNewAuthToken(): Promise<{
	newAccessToken: string;
	newAccessTokenExpiry: string;
}> {
	const refreshTokenId = (await Preferences.get({ key: 'dropbox_refresh_token_id' })).value;

	if (refreshTokenId === null) throw new Error('errors.refreshToken');

	const response = await fetch('/api/dropbox/refresh', {
		headers: {
			Authorization: refreshTokenId
		}
	});

	if (response.status === 500) throw new Error('errors.refreshToken');

	const responseJson = await response.json();

	const newAccessToken = responseJson.accessToken;
	const newAccessTokenExpiry = responseJson.accessTokenExpiry;

	return { newAccessToken, newAccessTokenExpiry };
}

export const PoemDropboxStorageDriver: IPoemStorageDriver = {
	listPoems: async function (): Promise<PoemFileEntity[]> {
		const accessToken = await getAuthCredentials();

		let requestId = (await Preferences.get({ key: 'poem_list_request_timestamp' })).value;

		if (requestId === null) {
			requestId = Date.now().toString();
			Preferences.set({ key: 'poem_list_request_timestamp', value: requestId });
		}

		const response = await fetch(`/api/dropbox/poem?cache=${requestId}`, {
			headers: {
				Authorization: accessToken
			}
		});

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
		const accessToken = await getAuthCredentials();

		const response = await fetch(`/api/dropbox/poem/${poemUri}`, {
			headers: {
				Authorization: accessToken
			}
		});

		if (response.status !== 200) throw new Error('errors.unknown');

		return new XMLParser().parse(await response.json());
	},
	savePoem: async function (poem: PoemEntity): Promise<void> {
		const accessToken = await getAuthCredentials();

		await fetch('/api/dropbox/poem', {
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
	updatePoem: async function (poem: PoemEntity, poemUri: string) {
		const accessToken = await getAuthCredentials();

		await fetch(`/api/dropbox/poem/${poemUri}`, {
			method: 'PATCH',
			headers: {
				Authorization: accessToken
			},
			body: JSON.stringify(poem)
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	},
	deletePoem: async function (poemUri: string) {
		const accessToken = await getAuthCredentials();

		await fetch(`/api/dropbox/poem/${poemUri}`, {
			method: 'DELETE',
			headers: {
				Authorization: accessToken
			}
		});

		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	}
};
