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

import { StorageProvider } from '../enums/StorageProvider';

import type { OAuth2Client } from 'google-auth-library';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000;

interface AuthenticatedRequestParams<T> {
	sessionId: string;
	accessToken: string | null;
	expiresAt: number | null;
	requestFn: (client: OAuth2Client) => Promise<T>;
}

interface AuthenticatedRequestResult<T> {
	data: T;
	tokenRefreshed: boolean;
	newToken?: {
		accessToken: string;
		expiresAt: number;
	};
}

async function getUserRefreshToken(sessionId: string): Promise<string> {
	return useStorage('redis').getItem<string>(`${StorageProvider.GOOGLE}:${sessionId}`);
}

async function storeUserRefreshToken(sessionId: string, refreshToken: string) {
	return useStorage('redis').setItem<string>(
		`${StorageProvider.GOOGLE}:${sessionId}`,
		refreshToken
	);
}

async function removeUserRefreshToken(sessionId: string) {
	return useStorage('redis').removeItem(`${StorageProvider.GOOGLE}:${sessionId}`);
}

function createOAuth2Client() {
	return new google.auth.OAuth2(
		useRuntimeConfig().google.clientId,
		useRuntimeConfig().google.clientSecret,
		`${useRuntimeConfig().serverUrl}/callback/${StorageProvider.GOOGLE}`
	);
}

export async function processCallback(code: string) {
	const { tokens } = await createOAuth2Client().getToken(code);

	let sessionId: string | null;

	if (tokens.refresh_token) {
		sessionId = randomBytes(32).toString('base64');
		await storeUserRefreshToken(sessionId, tokens.refresh_token);
	}

	return {
		accessToken: tokens.access_token,
		expiresAt: tokens.expiry_date,
		sessionId
	};
}

async function createOAuth2ClientFromRefreshToken(userId: string) {
	const oauth2Client = createOAuth2Client();
	const refreshToken = await getUserRefreshToken(userId);

	if (!refreshToken) {
		throw createError({
			statusCode: 401,
			message: 'No refresh token found for user'
		});
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

export async function makeAuthenticatedRequest<T>({
	sessionId,
	accessToken,
	expiresAt,
	requestFn
}: AuthenticatedRequestParams<T>): Promise<AuthenticatedRequestResult<T>> {
	const isExpired = !accessToken || !expiresAt || Date.now() > expiresAt - TOKEN_EXPIRATION_BUFFER;

	if (!isExpired) {
		console.log('access token is fresh!');
		const client = await createOAuth2ClientFromAccessToken(accessToken);
		return {
			data: await requestFn(client),
			tokenRefreshed: false
		};
	}

	const client = await createOAuth2ClientFromRefreshToken(sessionId);
	const { credentials } = await client.refreshAccessToken();

	if (credentials.refresh_token) {
		console.log('storing refresh token...');
		await storeUserRefreshToken(sessionId, credentials.refresh_token);
	}

	return {
		data: await requestFn(client),
		tokenRefreshed: true,
		newToken: {
			accessToken: credentials.access_token,
			expiresAt: credentials.expiry_date
		}
	};
}

export function getGoogleAuthUrl() {
	return createOAuth2Client().generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/drive.file',
		include_granted_scopes: true,
		prompt: 'consent'
	});
}
