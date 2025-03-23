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

import { initTRPC, TRPCError } from '@trpc/server';

import {
	createOAuth2ClientFromAccessToken,
	createOAuth2ClientFromRefreshToken,
	setUserRefreshToken
} from '../services/google-auth.service';

import type { Context } from './context';

const TOKEN_EXPIRATION_BUFFER = 5 * 60 * 1000;

const t = initTRPC.context<Context>().create();

const tokenRefresh = t.middleware(async ({ ctx, next }) => {
	if (!ctx.sessionId) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Not authenticated'
		});
	}

	const isExpired =
		!ctx.accessToken || !ctx.expiresAt || Date.now() > ctx.expiresAt - TOKEN_EXPIRATION_BUFFER;

	if (isExpired) {
		try {
			const client = await createOAuth2ClientFromRefreshToken(ctx.sessionId);
			const { credentials } = await client.refreshAccessToken();
			const { access_token, expiry_date } = credentials;

			if (!access_token || !expiry_date) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Got no access token'
				});
			}

			if (credentials.refresh_token) {
				console.log('storing refresh token...');
				await setUserRefreshToken(ctx.sessionId, credentials.refresh_token);
			}

			ctx.accessToken = access_token;
			ctx.expiresAt = expiry_date;

			const newToken = {
				accessToken: access_token,
				expiresAt: expiry_date,
				sessionId: ctx.sessionId
			};

			ctx.res.cookie('pokebook-session', JSON.stringify(newToken), {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 30 * 24 * 60 * 60 * 1000,
				path: '/'
			});
		} catch (e) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Failed to refresh token'
			});
		}
	}

	return next({ ctx });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(tokenRefresh);
