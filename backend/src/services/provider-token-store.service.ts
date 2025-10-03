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

import type { ProviderTokens } from '../types/provider-tokens';

const redis = await createClient({
	url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
	.on('error', (err) => console.error('Redis Client Error', err))
	.connect();

export class ProviderTokenStore<T extends ProviderTokens> {
	constructor(private readonly provider: T['provider']) {}

	async save(sessionId: string, tokens: Omit<T, 'provider'>): Promise<void> {
		const dataWithProvider = { ...tokens, provider: this.provider } as T;
		await redis.set(sessionId, JSON.stringify(dataWithProvider));
	}

	async get(sessionId: string): Promise<T | null> {
		const data = await redis.get(sessionId);

		if (!data) {
			return null;
		}

		try {
			const parsed = JSON.parse(data) as T;

			if (parsed.provider !== this.provider) {
				console.warn(`Provider mismatch: expected ${this.provider}, got ${parsed.provider}`);
				return null;
			}

			return parsed;
		} catch (error) {
			console.error('Failed to parse token data:', error);
			return null;
		}
	}

	async delete(sessionId: string): Promise<void> {
		await redis.del(sessionId);
	}
}
