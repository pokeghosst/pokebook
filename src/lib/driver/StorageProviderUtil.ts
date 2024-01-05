/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import type { StorageProvider } from '$lib/enums/StorageProvider';

export async function retrieveAccessToken(provider: StorageProvider) {
	const accessToken = (await Preferences.get({ key: `${provider}_access_token` })).value;
	const accessTokenExpiration = (
		await Preferences.get({ key: `${provider}_access_token_expiration` })
	).value;

	if (
		accessToken === null ||
		accessTokenExpiration === null ||
		parseInt(accessTokenExpiration) < Date.now()
	) {
		return null;
	} else {
		return accessToken;
	}
}

export async function refreshAndReturnAccessToken(provider: StorageProvider): Promise<string> {
	const refreshTokenId = (await Preferences.get({ key: `${provider}_refresh_token_id` })).value;

	if (refreshTokenId === null) throw new Error('errors.refreshToken');

	const refreshTokenResponse = await fetch(`/api/${provider}/refresh`, {
		headers: {
			Authorization: refreshTokenId
		}
	});

	if (refreshTokenResponse.status === 500) throw new Error('errors.refreshToken');

	const refreshTokenResponseJson = await refreshTokenResponse.json();

	const newAccessToken = refreshTokenResponseJson.accessToken;
	const newAccessTokenExpiration = refreshTokenResponseJson.accessTokenExpiry;

	Preferences.set({ key: `${provider}_access_token`, value: newAccessToken });
	Preferences.set({
		key: `${provider}_access_token_expiration`,
		value: newAccessTokenExpiration
	});

	return newAccessToken;
}
