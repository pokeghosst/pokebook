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

import { RIPEMD160 } from 'crypto-js';
import { Dropbox, DropboxAuth, type files } from 'dropbox';
import { XMLBuilder } from 'fast-xml-parser';

import { CredentialCacher } from '$lib/cache/CredentialsCacher';

import { StorageProvider } from '$lib/enums/StorageProvider';

import type { PoemEntity, PoemFileEntity } from '$lib/types';

import { env } from '$env/dynamic/private';

import { PUBLIC_POKEBOOK_BASE_URL } from '$env/static/public';

export const dropboxClient = new Dropbox({
	fetch: fetch,
	clientId: env.DROPBOX_APP_KEY,
	clientSecret: env.DROPBOX_APP_SECRET
});

export const dropboxAuthClient = new DropboxAuth({
	fetch: fetch,
	clientId: env.DROPBOX_APP_KEY,
	clientSecret: env.DROPBOX_APP_SECRET
});

export class DropboxClient {
	public static async getAuthUrl() {
		return await dropboxAuthClient.getAuthenticationUrl(
			`${PUBLIC_POKEBOOK_BASE_URL}/callback/dropbox`,
			'',
			'code',
			'offline',
			[],
			'none',
			false
		);
	}
	public static async processCallback(code: string) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { result }: any = await dropboxAuthClient.getAccessTokenFromCode(
			`${PUBLIC_POKEBOOK_BASE_URL}/callback/dropbox`,
			code
		);

		if (!result.refresh_token) throw new Error('dropboxCantProcessAuthCode');

		const refreshTokenId = RIPEMD160(result.refresh_token).toString();
		CredentialCacher.cacheCredential(StorageProvider.DROPBOX, refreshTokenId, result.refresh_token);

		return {
			accessToken: result.access_token,
			expiration: Date.now() + parseInt(result.expires_in) * 1000,
			refreshTokenId: refreshTokenId
		};
	}
	public static async revokeTokenAndLogOut(refreshTokenId: string) {
		dropboxAuthClient.setRefreshToken(await retrieveRefreshToken(refreshTokenId));
		new Dropbox({ auth: dropboxAuthClient }).authTokenRevoke();
		CredentialCacher.deleteCredential(StorageProvider.DROPBOX, refreshTokenId);
	}
	public static async refreshAccessToken(refreshTokenId: string) {
		dropboxAuthClient.setRefreshToken(await retrieveRefreshToken(refreshTokenId));
		dropboxAuthClient.refreshAccessToken();

		const accessToken = dropboxAuthClient.getAccessToken();
		const accessTokenExpiry = dropboxAuthClient.getAccessTokenExpiresAt();

		return {
			accessToken: accessToken,
			accessTokenExpiry: accessTokenExpiry
		};
	}
	public static async findAllPoems(accessToken: string) {
		const response = await new Dropbox({ accessToken: accessToken }).filesListFolder({ path: '' });
		const entries = response.result.entries as files.FileMetadataReference[];
		const files: PoemFileEntity[] = [];
		entries.forEach((entry) => {
			files.push({
				name: entry.name.split('_')[0],
				poemUri: entry.id,
				timestamp: entry.server_modified
			});
		});
		return files.reverse();
	}
	public static async getPoem(accessToken: string, poemId: string) {
		Buffer.from(
			(
				(await new Dropbox({ accessToken: accessToken }).filesDownload({
					path: poemId
					// The error says `fileBinary` does not exist on type but it's returned in the response
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				})) as any
			).result.fileBinary
		).toString();
	}
	public static async savePoem(accessToken: string, poem: PoemEntity) {
		await new Dropbox({ accessToken: accessToken }).filesUpload({
			contents: new XMLBuilder({ format: true }).build(poem),
			path: `/${poem.name}_${Date.now()}.xml`
		});
	}
	public static async updatePoem(accessToken: string, poemId: string, poem: PoemEntity) {
		const dbx = new Dropbox({ accessToken: accessToken });
		const response = await dbx.filesUpload({
			contents: new XMLBuilder({ format: true }).build(poem),
			path: poemId,
			mode: { '.tag': 'overwrite' }
		});
		await dbx.filesMoveV2({
			from_path: poemId,
			to_path: `/${poem.name}_${response.result.name.split('_')[1]}`
		});
	}
	public static async deletePoem(accessToken: string, poemId: string) {
		new Dropbox({ accessToken: accessToken }).filesDeleteV2({ path: poemId });
	}
}

async function retrieveRefreshToken(refreshTokenId: string) {
	const refreshToken = await CredentialCacher.retrieveCredential(
		StorageProvider.DROPBOX,
		refreshTokenId
	);

	if (!refreshToken) throw new Error('dropboxRefreshTokenMissing');

	return refreshTokenId;
}
