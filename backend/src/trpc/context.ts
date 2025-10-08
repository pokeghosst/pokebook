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

import { TRPCError } from '@trpc/server';

import { refreshAccessToken } from '../services/google-auth.service';
import { ProviderTokenStore } from '../services/provider-token-store.service';
import { parseCookie } from '../util/cookies';

import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const createContext = async (opts: CreateWSSContextFnOptions) => {
	const cookie = opts.req.headers.cookie;

	if (!cookie)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Not authenticated'
		});

	const pokebookSession = parseCookie(cookie, 'pokebook-session');

	if (!pokebookSession)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Not authenticated'
		});

	const [cloudProvider, sessionId] = pokebookSession.split('.');

	switch (cloudProvider) {
		case 'google':
			const tokenStore = new ProviderTokenStore();
			const token = await tokenStore.get(sessionId);

			if (!token)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Not authenticated'
				});

			if (token.isExpired()) {
				const newToken = await refreshAccessToken(token.refreshToken);
				await tokenStore.save(sessionId, newToken);
				return newToken;
			}

			return token;
		default:
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'Unsupported provider'
			});
	}
};

export type Context = Awaited<ReturnType<typeof createContext>>;
