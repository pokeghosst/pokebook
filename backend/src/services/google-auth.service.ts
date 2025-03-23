/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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

import { randomBytes } from 'crypto';
import { google } from 'googleapis';
import { createClient } from 'redis';

import type { OAuth2Client } from 'google-auth-library';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000;

interface AuthenticatedRequestParams<T, P extends any[] = []> {
	sessionId: string;
	accessToken: string | null;
	expiresAt: number | null;
	requestFn: (client: OAuth2Client, ...params: P) => Promise<T>;
	requestParams?: P;
}

interface AuthenticatedRequestResult<T> {
	data: T;
	tokenRefreshed: boolean;
	newToken?: {
		accessToken: string;
		expiresAt: number;
	};
}

const redis = await createClient({
	url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
	.on('error', (err) => console.log('Redis Client Error', err))
	.connect();

async function getUserRefreshToken(sessionId: string): Promise<string | null> {
	return redis.get(`google:${sessionId}`);
}

export async function setUserRefreshToken(sessionId: string, refreshToken: string) {
	return redis.set(`google:${sessionId}`, refreshToken);
}

async function deleteUserRefreshToken(sessionId: string) {
	return redis.del(`google:${sessionId}`);
}

function createOAuth2Client() {
	return new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		`${process.env.SERVER_URL}/google/callback`
	);
}

export async function processCallback(code: string) {
	const { tokens } = await createOAuth2Client().getToken(code);

	let sessionId: string | null = null;

	if (tokens.refresh_token) {
		sessionId = randomBytes(32).toString('base64');
		await setUserRefreshToken(sessionId, tokens.refresh_token);
	}

	return {
		accessToken: tokens.access_token,
		expiresAt: tokens.expiry_date,
		sessionId
	};
}

export async function createOAuth2ClientFromRefreshToken(userId: string) {
	const oauth2Client = createOAuth2Client();
	const refreshToken = await getUserRefreshToken(userId);

	if (!refreshToken) {
		throw new Error('No refresh token found for user');
	}

	oauth2Client.setCredentials({
		refresh_token: refreshToken
	});

	return oauth2Client;
}

export async function createOAuth2ClientFromAccessToken(accessToken: string) {
	const oauth2Client = createOAuth2Client();
	oauth2Client.setCredentials({ access_token: accessToken });
	return oauth2Client;
}

// export async function makeAuthenticatedRequest<T, P extends any[] = []>({
// 	sessionId,
// 	accessToken,
// 	expiresAt,
// 	requestFn,
// 	requestParams = [] as unknown as P
// }: AuthenticatedRequestParams<T, P>): Promise<AuthenticatedRequestResult<T>> {
// 	const isExpired = !accessToken || !expiresAt || Date.now() > expiresAt - TOKEN_EXPIRATION_BUFFER;

// 	if (!isExpired) {
// 		console.log('access token is fresh!');
// 		const client = await createOAuth2ClientFromAccessToken(accessToken);
// 		return {
// 			data: await requestFn(client, ...requestParams),
// 			tokenRefreshed: false
// 		};
// 	}

// 	const client = await createOAuth2ClientFromRefreshToken(sessionId);
// 	const { credentials } = await client.refreshAccessToken();

// 	if (credentials.refresh_token) {
// 		console.log('storing refresh token...');
// 		await setUserRefreshToken(sessionId, credentials.refresh_token);
// 	}

// 	return {
// 		data: await requestFn(client, ...requestParams),
// 		tokenRefreshed: true,
// 		newToken: {
// 			accessToken: credentials.access_token,
// 			expiresAt: credentials.expiry_date
// 		}
// 	};
// }

export function getGoogleAuthUrl() {
	return createOAuth2Client().generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/drive.file',
		include_granted_scopes: true,
		prompt: 'consent'
	});
}
