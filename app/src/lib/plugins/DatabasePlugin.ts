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

import type { Poem, PoemListItem, PoemRecord } from '@pokebook/shared';

export interface DatabasePlugin {
	save(
		record: Omit<PoemRecord, 'id' | 'createdAt' | 'updatedAt'> &
			Partial<Pick<PoemRecord, 'id' | 'createdAt' | 'updatedAt'>>
	): Promise<string>;
	putPartialUpdate(id: string, update: Partial<Poem>): Promise<void>;
	get(id: string): Promise<PoemRecord | undefined>;
	getAll(): Promise<PoemRecord[]>;
	list(): Promise<PoemListItem[]>;
	update(poem: Omit<PoemRecord, 'createdAt' | 'updatedAt'>): Promise<void>;
	delete(id: string): Promise<void>;
}
