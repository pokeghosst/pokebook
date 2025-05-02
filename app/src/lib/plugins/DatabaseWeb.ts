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

import { DexieError } from '$lib/util/errors';
import type { Poem, PoemListItem, PoemRecord } from '@pokebook/shared';
import type { DatabasePlugin } from './DatabasePlugin';

class PokeBookDB extends Dexie {
	poems!: EntityTable<PoemRecord, 'id'>;

	constructor() {
		super('pokebook4');
		this.version(1).stores({
			poems: '&id, name, text, note, snippet, remoteId, syncState'
		});
	}
}

export class DatabaseWeb implements DatabasePlugin {
	#db: PokeBookDB;

	constructor() {
		this.#db = new PokeBookDB();
	}

	async save(
		record: Omit<PoemRecord, 'id' | 'createdAt' | 'updatedAt'>,
		idOverride?: string
	): Promise<string> {
		const uuid = idOverride ?? crypto.randomUUID();
		const timestamp = Date.now();

		await this.#db.poems.add({
			id: uuid,
			createdAt: timestamp,
			updatedAt: timestamp,
			...record
		});

		return uuid;
	}
	async putPartialUpdate(id: string, update: Partial<Poem>): Promise<void> {
		const timestamp = Date.now();
		try {
			const savedPoem = await this.#db.poems.get(id);

			if (savedPoem) {
				await this.#db.poems.update(id, {
					...update,
					updatedAt: timestamp
				});
			} else {
				await this.#db.poems.add({
					id,
					createdAt: timestamp,
					updatedAt: timestamp,
					name: update.name ?? '',
					text: update.text ?? '',
					note: update.note ?? '',
					snippet: '',
					syncState: ''
				});
			}
		} catch (e: unknown) {
			console.error(e);
			throw new DexieError().withCause(e);
		}
	}
	async get(id: string): Promise<(Poem & { syncState: string }) | undefined> {
		const poem = await this.#db.poems.get(id);

		if (!poem) return undefined;

		return {
			name: poem.name,
			text: poem.text,
			note: poem.note,
			syncState: poem.syncState
		};
	}
	async getAll(): Promise<PoemRecord[]> {
		return await this.#db.poems.toArray();
	}
	async list(): Promise<PoemListItem[]> {
		const poems = await this.#db.poems.toArray();

		return poems.map((poem) => ({
			id: poem.id,
			name: poem.name,
			snippet: poem.snippet,
			createdAt: poem.createdAt,
			updatedAt: poem.updatedAt,
			remoteId: poem.remoteId
		}));
	}
	async update(record: Omit<PoemRecord, 'createdAt' | 'updatedAt'>): Promise<void> {
		await this.#db.poems.update(record.id, { ...record, updatedAt: Date.now() });
	}
	async delete(id: string): Promise<void> {
		await this.#db.poems.delete(id);
	}
}
