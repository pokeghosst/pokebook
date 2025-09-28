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

import { createClient } from 'redis';

const redis = await createClient({
	url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
	.on('error', (err) => console.error('Redis Client Error', err))
	.connect();

export async function getSession(sessionId: string): Promise<string | null> {
	return redis.get(sessionId);
}

export async function createSession<T = Record<string, unknown>>(sessionId: string, data: T) {
	return redis.set(sessionId, JSON.stringify(data));
}

// TODO: Don't forget to actually delete sessions on logging out
export async function deleteSession(sessionId: string) {
	return redis.del(sessionId);
}
