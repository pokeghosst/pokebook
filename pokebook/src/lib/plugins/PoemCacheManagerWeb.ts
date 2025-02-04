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

import database from './DexieManager';

import type { PoemCacheManagerPlugin } from '$lib/plugins/PoemCacheManagerPlugin.ts';
import type { PoemCacheRecord } from '$lib/types';

export class PoemCacheManagerWeb implements PoemCacheManagerPlugin {
	get(key: string): Promise<PoemCacheRecord | null> {
		throw new Error('Method not implemented.');
	}
	pop(key: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	async list(): Promise<PoemCacheRecord[]> {
		console.log('>>> reading poem list...');

		return await database.poemCache.toArray();
	}
	async push(poem: PoemCacheRecord) {
		console.log('>>> writing poem list...');
		const id = await database.poemCache.add(poem);

		if (!id) throw new Error('Could not save poem to cache');
		return id;
	}
}
