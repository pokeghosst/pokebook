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

export async function getUserRefreshToken(sessionId: string): Promise<string | null> {
	return redis.get(`google:${sessionId}`);
}

export async function setUserRefreshToken(sessionId: string, refreshToken: string) {
	return redis.set(`google:${sessionId}`, refreshToken);
}

// TODO: Implement token deletion!
export async function deleteUserRefreshToken(sessionId: string) {
	return redis.del(`google:${sessionId}`);
}
