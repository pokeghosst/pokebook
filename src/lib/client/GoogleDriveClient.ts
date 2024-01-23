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

import RIPEMD160 from 'crypto-js/ripemd160';
import { XMLBuilder } from 'fast-xml-parser';
import { google } from 'googleapis';

import { CredentialCacher } from '$lib/cache/CredentialsCacher';

import { StorageProvider } from '$lib/enums/StorageProvider';

import type { PoemEntity } from '$lib/types';

import { env } from '$env/dynamic/private';
import { PUBLIC_POKEBOOK_BASE_URL, PUBLIC_POKEBOOK_FOLDER_NAME } from '$env/static/public';

export const googleClient = new google.auth.OAuth2(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	PUBLIC_POKEBOOK_BASE_URL + `/callback/${StorageProvider.GOOGLE}`
);

export class GoogleDriveClient {
	public static async getAuthUrl() {
		return googleClient.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/drive.file',
			include_granted_scopes: true
		});
	}
	public static async processCallback(code: string) {
		const { tokens } = await googleClient.getToken(code);

		let refreshTokenId;

		if (tokens.refresh_token) {
			refreshTokenId = RIPEMD160(tokens.refresh_token).toString();
			CredentialCacher.cacheCredential(
				StorageProvider.GOOGLE,
				refreshTokenId,
				tokens.refresh_token
			);
		}

		return {
			accessToken: tokens.access_token,
			accessTokenExpiration: tokens.expiry_date,
			refreshTokenId: refreshTokenId
		};
	}
	public static async revokeTokenAndLogOut(refreshTokenId: string) {
		const refreshToken = await CredentialCacher.retrieveCredential(
			StorageProvider.GOOGLE,
			refreshTokenId
		);

		if (refreshToken) {
			googleClient.revokeToken(refreshToken);
			CredentialCacher.deleteCredential(StorageProvider.GOOGLE, refreshTokenId);
		} 
	}
	public static async refreshAccessToken(refreshTokenId: string) {
		const refreshToken = await CredentialCacher.retrieveCredential(
			StorageProvider.GOOGLE,
			refreshTokenId
		);

		if (refreshToken === undefined) return null;

		googleClient.setCredentials({ refresh_token: refreshToken });
		const { res } = await googleClient.getAccessToken();

		return {
			accessToken: res?.data.access_token,
			accessTokenExpiration: res?.data.expiry_date
		};
	}
	public static async getPokeBookFolderId(accessToken: string) {
		googleClient.setCredentials({ access_token: accessToken });

		let pokebookFolderId;
		const drive = google.drive('v3');

		const results = await drive.files.list({
			q: `mimeType='application/vnd.google-apps.folder' and name='${PUBLIC_POKEBOOK_FOLDER_NAME}'`,
			fields: 'files(id)',
			auth: googleClient
		});

		if (results.data.files && results.data.files.length > 0) {
			pokebookFolderId = results.data.files[0].id;
		} else {
			const response = await drive.files.create({
				requestBody: {
					name: PUBLIC_POKEBOOK_FOLDER_NAME,
					mimeType: 'application/vnd.google-apps.folder'
				},
				fields: 'id',
				auth: googleClient
			});
			pokebookFolderId = response.data.id;
		}

		return pokebookFolderId;
	}
	public static async findAllPoems(accessToken: string, pokebookFolderId: string) {
		googleClient.setCredentials({ access_token: accessToken });

		return (
			await google.drive('v3').files.list({
				q: `'${pokebookFolderId}' in parents and trashed=false`,
				orderBy: 'createdTime desc',
				auth: googleClient,
				fields: 'nextPageToken,files(id,name,createdTime,properties)'
			})
		).data.files;
	}
	public static async getPoem(accessToken: string, poemId: string) {
		googleClient.setCredentials({ access_token: accessToken });
		return Buffer.from(
			(
				await google.drive('v3').files.get(
					{
						fileId: poemId,
						alt: 'media',
						auth: googleClient
					},
					{
						responseType: 'arraybuffer'
					}
				)
			).data as ArrayBuffer
		).toString();
	}
	public static async savePoem(accessToken: string, pokebookFolderId: string, poem: PoemEntity) {
		googleClient.setCredentials({ access_token: accessToken });

		await google.drive('v3').files.create({
			auth: googleClient,
			requestBody: {
				name: `${poem.name}.xml`,
				parents: [pokebookFolderId]
			},
			media: {
				mimeType: 'text/xml',
				body: new XMLBuilder({ format: true }).build(poem)
			}
		});
	}
	public static async updatePoem(accessToken: string, poemId: string, poem: PoemEntity) {
		googleClient.setCredentials({ access_token: accessToken });

		await google.drive('v3').files.update({
			auth: googleClient,
			fileId: poemId,
			requestBody: {
				name: `${poem.name}.xml`
			},
			media: {
				mimeType: 'text/xml',
				body: new XMLBuilder({ format: true }).build(poem)
			}
		});
	}
	public static async deletePoem(accessToken: string, poemId: string) {
		googleClient.setCredentials({ access_token: accessToken });

		await google.drive('v3').files.delete({
			auth: googleClient,
			fileId: poemId
		});
	}
}
