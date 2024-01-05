/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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

import type { StorageProvider } from '$lib/enums/StorageProvider';

import type { ICredentialCacher } from './ICredentialCacher';

export const CredentialCacher: ICredentialCacher = {
	cacheCredential: async function (
		credentialKey: StorageProvider,
		credentialId: string,
		credential: string
	) {
		await redisClient.hSet(credentialKey, credentialId, credential);
	},
	retrieveCredential: async function (credentialKey: StorageProvider, credentialId: string) {
		return await redisClient.hGet(credentialKey, credentialId);
	},
	deleteCredential: async function (credentialKey: StorageProvider, credentialId: string) {
		await redisClient.hDel(credentialKey, credentialId);
	}
};
