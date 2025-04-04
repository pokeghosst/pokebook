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

import Dexie, { type EntityTable } from 'dexie';
import type { DatabasePlugin } from './DatabasePlugin';
import type { Poem, PoemListItem, PoemRecord } from '@pokebook/shared';

const db = new Dexie('pokebook4') as Dexie & {
	poems: EntityTable<PoemRecord, 'id'>;
};

db.version(1).stores({
	poems: 'id, name, text, note, snippet, remoteId, syncState'
});

export class DatabaseWeb implements DatabasePlugin {
	async save(record: Omit<PoemRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
		const uuid = crypto.randomUUID();
		const timestamp = new Date();

		await db.poems.add({
			id: uuid,
			createdAt: timestamp,
			updatedAt: timestamp,
			...record
		});

		return uuid;
	}
	async get(id: string): Promise<Poem | undefined> {
		const poem = await db.poems.get(id);

		if (!poem) return undefined;

		return {
			name: poem.name,
			text: poem.text,
			note: poem.note
		};
	}
	async getAll(): Promise<PoemRecord[]> {
		return await db.poems.toArray();
	}
	async list(): Promise<PoemListItem[]> {
		const poems = await db.poems.toArray();

		return poems.map((poem) => ({
			id: poem.id,
			name: poem.name,
			snippet: poem.snippet,
			createdAt: poem.createdAt,
			updatedAt: poem.updatedAt
		}));
	}
	async update(id: string, poem: PoemRecord): Promise<void> {
		await db.poems.update(id, poem);
	}
	async delete(id: string): Promise<void> {
		await db.poems.delete(id);
	}
}
