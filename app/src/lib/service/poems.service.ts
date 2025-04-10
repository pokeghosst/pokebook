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

import { PoemDoc } from '$lib/models/PoemDoc';
import { Database } from '$lib/plugins/Database';

import type { Poem, PoemListItem, PoemRecord } from '@pokebook/shared';

const POEM_SNIPPET_LENGTH = 256;

export async function savePoem(poem: Poem): Promise<string> {
	const snippet = sliceSnippet(poem.text);
	const doc = new PoemDoc(poem);

	return await Database.save({ ...poem, snippet, syncState: doc.getEncodedState() });
}

export async function getPoem(id: string): Promise<Poem | undefined> {
	const poem = await Database.get(id);

	return poem;
}

export async function deletePoem(id: string) {
	await Database.delete(id);
}

export async function putPartialUpdate(id: string, update: Partial<PoemRecord>) {
	await Database.putPartialUpdate(id, { ...update, snippet: sliceSnippet(update.text ?? '') });
}

export async function listPoems(): Promise<PoemListItem[]> {
	return (await Database.list()).filter((poem) => !poem.id.includes('.tmp'));
}

function sliceSnippet(text: string): string {
	return text.slice(0, POEM_SNIPPET_LENGTH) + (text.length > POEM_SNIPPET_LENGTH ? '...' : '');
}
