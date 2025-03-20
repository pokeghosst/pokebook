// /*
// PokeBook -- Pokeghost's poetry noteBook
// Copyright (C) 2023-2025 Pokeghost.

// PokeBook is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// PokeBook is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
// */

// import { randomBytes } from 'crypto';

// import { XMLBuilder } from 'fast-xml-parser';
// import { google } from 'googleapis';

// import { StorageProvider } from '../enums/StorageProvider';

// import type { PoemEntity } from '../types/PoemEntity';

// export class GoogleDriveClient {
// 	public static async revokeTokenAndLogOut(sessionId: string) {
// 		const refreshToken = await getUserRefreshToken(sessionId);

// 		if (refreshToken) {
// 			const googleClient = await createOAuth2ClientFromRefreshToken(sessionId);
// 			googleClient.revokeToken(refreshToken);
// 			await removeUserRefreshToken(sessionId);
// 		}
// 	}
// 	public static async refreshAccessToken(refreshTokenId: string) {
// 		const refreshTokenValue = await useStorage('redis').getItem(
// 			`${StorageProvider.GOOGLE}:${refreshTokenId}`
// 		);

// 		googleClient.setCredentials({ refresh_token: refreshTokenValue.toString() });
// 		const { res } = await googleClient.getAccessToken();

// 		return {
// 			accessToken: res?.data.access_token,
// 			accessTokenExpiration: res?.data.expiry_date
// 		};
// 	}

// 	public static async findAllPoems(accessToken: string, pokebookFolderId: string) {
// 		googleClient.setCredentials({ access_token: accessToken });

// 		return (
// 			await google.drive('v3').files.list({
// 				q: `'${pokebookFolderId}' in parents and trashed=false`,
// 				orderBy: 'createdTime desc',
// 				auth: googleClient,
// 				fields: 'nextPageToken,files(id,name,createdTime,properties)'
// 			})
// 		).data.files;
// 	}
// 	public static async getPoem(accessToken: string, poemId: string) {
// 		googleClient.setCredentials({ access_token: accessToken });
// 		return Buffer.from(
// 			(
// 				await google.drive('v3').files.get(
// 					{
// 						fileId: poemId,
// 						alt: 'media',
// 						auth: googleClient
// 					},
// 					{
// 						responseType: 'arraybuffer'
// 					}
// 				)
// 			).data as ArrayBuffer
// 		).toString();
// 	}
// 	public static async savePoem(accessToken: string, pokebookFolderId: string, poem: PoemEntity) {
// 		googleClient.setCredentials({ access_token: accessToken });

// 		const { id } = (
// 			await google.drive('v3').files.create({
// 				auth: googleClient,
// 				requestBody: {
// 					name: `${poem.name}.xml`,
// 					parents: [pokebookFolderId]
// 				},
// 				media: {
// 					mimeType: 'text/xml',
// 					body: new XMLBuilder({ format: true }).build(poem)
// 				}
// 			})
// 		).data;

// 		return id;
// 	}
// 	public static async updatePoem(accessToken: string, poemId: string, poem: PoemEntity) {
// 		googleClient.setCredentials({ access_token: accessToken });

// 		await google.drive('v3').files.update({
// 			auth: googleClient,
// 			fileId: poemId,
// 			requestBody: {
// 				name: `${poem.name}.xml`
// 			},
// 			media: {
// 				mimeType: 'text/xml',
// 				body: new XMLBuilder({ format: true }).build(poem)
// 			}
// 		});
// 	}
// 	public static async deletePoem(accessToken: string, poemId: string) {
// 		googleClient.setCredentials({ access_token: accessToken });

// 		await google.drive('v3').files.delete({
// 			auth: googleClient,
// 			fileId: poemId
// 		});
// 	}
// }
