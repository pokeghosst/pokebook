/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2026 Pokeghost.

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

import type { Poem } from '$lib/schema/poem.schema';
import {
	BlobReader,
	BlobWriter,
	TextReader,
	TextWriter,
	ZipReader,
	ZipWriter
} from '@zip.js/zip.js';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { getPoem, listPoems, savePoem } from './poem.service';

export async function exportPoems() {
	const poemList = await listPoems();

	const filePromises = poemList.map(async (meta) => {
		const poem = await getPoem(meta.id);
		if (!poem) return [];

		return [
			{
				data: new XMLBuilder({ format: true }).build(poem),
				filename: `${poem.name}_${meta.timestamp}.xml`
			}
		];
	});
	const files = (await Promise.all(filePromises)).flat();

	const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
	const zipPromises = files.map(async (file) => {
		return zipWriter.add(file.filename, new TextReader(file.data));
	});

	await Promise.all(zipPromises);
	const blob = await zipWriter.close();

	Object.assign(document.createElement('a'), {
		download: `pokebook_poems_${Date.now()}.zip`,
		href: URL.createObjectURL(blob),
		textContent: 'Download zip file'
	}).click();
}

export async function importPoems(event: SubmitEvent) {
	event.preventDefault();
	const target = event.target as HTMLFormElement;
	const fileInput = target.poemArchive as HTMLInputElement;
	const file: File | undefined = fileInput.files?.[0];

	if (!file || !file.type.startsWith('application/zip')) {
		// TODO: Toast here
		alert('Please select a zip file');
		return;
	}

	const blobReader = new BlobReader(file);
	const zipReader = new ZipReader(blobReader);

	const entries = await zipReader.getEntries();

	const poemPromises = entries.map(async (entry) => {
		if (!entry.filename.endsWith('.xml') || !('getData' in entry)) return [];

		const textWriter = new TextWriter();

		const timestamp = parseInt(entry.filename.split(/_|\.xml/)[1]);

		const contents = await entry.getData(textWriter);
		try {
			return {
				contents: new XMLParser().parse(contents) as Poem,
				timestamp: Number.isNaN(timestamp) ? Date.now() : timestamp
			};
		} catch (e) {
			console.warn('Failed to parse', entry.filename, e);
			return [];
		}
	});

	await zipReader.close();

	const poems = (await Promise.all(poemPromises)).flat().reverse();

	for (const poem of poems) {
		await savePoem(poem.contents, poem.timestamp);
	}

	// TODO: Toast here
	alert(`Successfully imported ${poems.length} poems`);
}
