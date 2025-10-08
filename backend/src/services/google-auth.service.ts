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

import { google } from 'googleapis';

import { CloudToken } from '../models/cloud-token';
import { ProviderTokenStore } from './provider-token-store.service';

import type { OAuth2Client } from 'google-auth-library';

const googleTokenStore = new ProviderTokenStore();

function createOAuth2Client() {
	return new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		`${process.env.SERVER_URL}/google/callback`
	);
}

export async function processCallback(code: string) {
	const { tokens } = await createOAuth2Client().getToken(code);

	return new CloudToken(tokens.refresh_token!, tokens.access_token!, tokens.expiry_date!);
}

export async function refreshAccessToken(refreshToken: string): Promise<CloudToken> {
	const client = await createOAuth2ClientFromRefreshToken(refreshToken);
	const { credentials } = await client.refreshAccessToken();
	const { access_token, expiry_date } = credentials;

	if (!access_token || !expiry_date) {
		throw new Error('Got no access token');
	}

	return new CloudToken(refreshToken, access_token, expiry_date);
}

export async function createOAuth2ClientFromRefreshToken(
	refreshToken: string
): Promise<OAuth2Client> {
	const client = createOAuth2Client();

	client.setCredentials({
		refresh_token: refreshToken
	});

	return client;
}

export async function createOAuth2ClientFromAccessToken(
	accessToken: string
): Promise<OAuth2Client> {
	const oauth2Client = createOAuth2Client();
	oauth2Client.setCredentials({ access_token: accessToken });
	return oauth2Client;
}

export function getGoogleAuthUrl() {
	return createOAuth2Client().generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/drive.file',
		include_granted_scopes: true,
		prompt: 'consent'
	});
}
