/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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

import { redisClient } from '../client/RedisClient';

import type { ICredentialCacher } from './ICredentialCacher';

const GOOGLE_REDIS_KEY = 'google';

export const GoogleCredentialCacher: ICredentialCacher = {
	cacheCredential: async function (credentialId: string, credential: string) {
		await redisClient.hSet(GOOGLE_REDIS_KEY, credentialId, credential);
	},
	retrieveCredential: async function (credentialId: string) {
		return await redisClient.hGet(GOOGLE_REDIS_KEY, credentialId);
	}
};
