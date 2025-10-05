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

import { ProviderTokenStore } from './provider-token-store.service';

import type { OAuth2Client } from 'google-auth-library';
import type { GoogleTokens } from '../types/provider-tokens';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000;

const googleTokenStore = new ProviderTokenStore<GoogleTokens>();

function createOAuth2Client() {
	return new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		`${process.env.SERVER_URL}/google/callback`
	);
}

export async function processCallback(code: string): Promise<GoogleTokens> {
	const { tokens } = await createOAuth2Client().getToken(code);

	return {
		refreshToken: tokens.refresh_token!,
		accessToken: tokens.access_token!,
		expiresAt: tokens.expiry_date!
	};
}

// TODO: SessionID?
export async function createOAuth2ClientFromRefreshToken(userId: string): Promise<OAuth2Client> {
	const oauth2Client = createOAuth2Client();
	const tokens = await googleTokenStore.get(userId);

	if (!tokens) {
		throw new Error('No tokens found for user');
	}

	oauth2Client.setCredentials({
		refresh_token: tokens.refreshToken
	});

	return oauth2Client;
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
