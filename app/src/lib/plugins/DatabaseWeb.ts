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

import type { PoemDoc, PoemMeta, PoemRecord } from '@pokebook/shared';
import type { DatabasePlugin } from './DatabasePlugin';

const POEM_SNIPPET_LENGTH = 256;

class PokeBookDB extends Dexie {
	poemDocs!: EntityTable<PoemRecord, 'id'>;
	poemMeta!: EntityTable<PoemMeta, 'id'>;

	constructor() {
		super('PokeBook4');
		this.version(1).stores({
			poemDocs: '&id',
			poemMeta: 'id'
		});
	}
}

export class DatabaseWeb implements DatabasePlugin {
	#db: PokeBookDB;

	constructor() {
		this.#db = new PokeBookDB();
	}

	async create(doc: PoemDoc): Promise<string> {
		try {
			const uuid = crypto.randomUUID();

			await this.#db.transaction('rw', this.#db.poemDocs, this.#db.poemMeta, async () => {
				await this.#db.poemDocs.add({
					id: uuid,
					doc: doc.encodeStateAsUpdate()
				});

				const timestamp = Date.now();

				this.#db.poemMeta.add({
					id: uuid,
					name: doc.name.toString(),
					snippet: sliceSnippet(doc.text.toString()),
					createdAt: timestamp,
					updatedAt: timestamp
				});
			});

			return uuid;
		} catch (e: unknown) {
			console.error(e);
			throw new DexieError().withCause(e);
		}
	}
	async list(): Promise<PoemMeta[]> {
		return await this.#db.poemMeta.toArray();
	}

	async get(id: string): Promise<PoemRecord | undefined> {
		return await this.#db.poemDocs.get(id);
	}
}

function sliceSnippet(text: string): string {
	return text.slice(0, POEM_SNIPPET_LENGTH) + (text.length > POEM_SNIPPET_LENGTH ? '...' : '');
}
