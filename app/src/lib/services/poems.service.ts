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

import { Database } from '$lib/plugins/Database';
import { PoemNotFoundError } from '$lib/util/errors';
import { PoemDoc } from '@pokebook/shared';
import { diffChars } from 'diff';

import type { Poem, PoemMeta, PoemRecord } from '@pokebook/shared';
import type { Text as YText } from 'yjs';

export async function savePoem(poem: Poem): Promise<string> {
	return await Database.create(new PoemDoc(poem));
}

export async function getPoem(id: string): Promise<PoemRecord | undefined> {
	return await Database.get(id);
}

export async function deletePoem(id: string) {
	await Database.delete(id);
}

export async function updatePoem(id: string, poem: Poem) {
	const oldRecord = await Database.get(id);

	if (!oldRecord) throw new PoemNotFoundError();

	console.log(oldRecord);

	const poemDoc = PoemDoc.fromEncodedState(oldRecord.syncState);

	poemDoc
		.setTitle(applyDiffToYText(oldRecord.name, poem.name, poemDoc.getTitle()))
		.setText(applyDiffToYText(oldRecord.text, poem.text, poemDoc.getText()))
		.setNote(applyDiffToYText(oldRecord.note, poem.note, poemDoc.getNote()));

	const syncStateHash = await poemDoc.getEncodedStateHash();
	const stateVector = poemDoc.getEncodedStateVector();

	const newRecord: Omit<PoemRecord, 'createdAt' | 'updatedAt'> = {
		...poem,
		id,
		snippet: sliceSnippet(poem.text),
		syncState: poemDoc.getEncodedState(),
		syncStateHash,
		stateVector
	};

	await Database.update(newRecord);
}

export async function putPartialUpdate(id: string, update: Partial<PoemRecord>) {
	await Database.putPartialUpdate(id, update);
}

export async function listPoems(): Promise<PoemMeta[]> {
	return await Database.list();
}

function applyDiffToYText(oldString: string, newString: string, yText: YText) {
	const diffs = diffChars(oldString, newString);
	let currentPosition = 0;
	const yTextCopy = yText;

	diffs.forEach((diff) => {
		if (diff.added) {
			yTextCopy.insert(currentPosition, diff.value);
			currentPosition += diff.value.length;
		} else if (diff.removed) {
			yTextCopy.delete(currentPosition, diff.value.length);
		} else {
			currentPosition += diff.value.length;
		}
	});

	return yTextCopy;
}
