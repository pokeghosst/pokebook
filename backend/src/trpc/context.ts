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
import { parseCookie } from '../util/cookies';

import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const createContext = async (opts: CreateWSSContextFnOptions) => {
	const cookie = opts.req.headers.cookie;

	if (!cookie)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Not authenticated'
		});

	const sessionId = parseCookie(cookie, 'pokebook-session');

	if (!sessionId)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Not authenticated'
		});

	// const session = await getSess(sessionId);

	// console.log('session', session);

	return { sessionId };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
