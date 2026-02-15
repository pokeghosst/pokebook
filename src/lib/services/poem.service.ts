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

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Filesystem } from '../plugins/Filesystem';
import { Directory, Encoding } from '../plugins/FilesystemPlugin';
import type { PoemMeta } from '../schema/manifest.schema';
import type { Poem } from '../schema/poem.schema';
import { poemSchema } from '../schema/poem.schema';
import { validate } from '../schema/validation';
import { isPathExists } from '../util/filesystem';
import {
	deleteManifestEntry,
	getManifestEntries,
	updateManifestEntry,
	writeToManifest
} from './manifest.service';

const SNIPPET_LENGTH = 128;

export async function listPoems(): Promise<PoemMeta[]> {
	if (!(await isPathExists('poems'))) return [];

	const storedFiles = (await Filesystem.readdir({ path: 'poems', directory: Directory.Documents }))
		.files;
	const manifestEntries: PoemMeta[] = await getManifestEntries();

	return storedFiles
		.filter((file) => !file.name.includes('.json'))
		.map((file) => (file.name.includes('.tmp') ? { ...file, name: `(tmp) ${file.name}` } : file))
		.map((file) => {
			const fileMeta = manifestEntries.find((p) => p.id === file.uri);

			return {
				id: file.uri,
				name: file.name.split('_')[0].replace(/%20/g, ' '),
				/*
                    ctime is not available on Android 7 and older devices.
                    The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
                */
				timestamp: file.ctime ?? file.mtime,
				unsavedChanges: fileMeta?.unsavedChanges ?? false,
				poemSnippet: fileMeta?.poemSnippet ?? ''
			};
		})
		.sort((a, b) => (b.timestamp as number) - (a.timestamp as number));
}

export async function getPoem(uri: string): Promise<Poem> {
	const file = await Filesystem.readFile({ path: uri, encoding: Encoding.UTF8 });
	const parsedFile = new XMLParser().parse(file.data.toString());

	if (validate(parsedFile, poemSchema)) {
		return parsedFile;
	} else {
		throw new Error('The file is not a poem.');
	}
}

export async function savePoem(poem: Poem): Promise<void> {
	const timestamp = Date.now();

	const { uri } = await Filesystem.writeFile({
		path: `poems/${poem.name}_${timestamp}.xml`,
		data: new XMLBuilder({ format: true }).build(poem),
		directory: Directory.Documents,
		encoding: Encoding.UTF8,
		recursive: true
	});

	const savedPoemManifest = {
		id: uri,
		unsavedChanges: false,
		poemSnippet: sliceSnippet(poem.text, SNIPPET_LENGTH)
	};

	const manifestEntries = await getManifestEntries();

	writeToManifest([...manifestEntries, savedPoemManifest]);
}

export async function updatePoem(uri: string, poem: Poem): Promise<string> {
	await Filesystem.writeFile({
		path: uri,
		data: new XMLBuilder({ format: true }).build(poem),
		encoding: Encoding.UTF8
	});

	const [directory, rest] = uri.split('poems/');
	const timestamp = rest.split(/_|\.xml/)[1];

	const newUri = `${directory}poems/${poem.name}_${timestamp}.xml`;

	if (uri !== newUri) await Filesystem.rename({ from: uri, to: newUri });

	const newManifest = {
		id: newUri,
		unsavedChanges: false,
		poemSnippet: sliceSnippet(poem.text, SNIPPET_LENGTH)
	};

	await updateManifestEntry(uri, newManifest);

	return newUri;
}

export async function deletePoem(uri: string): Promise<void> {
	await Filesystem.deleteFile({ path: uri });
	await deleteManifestEntry(uri);
}

function sliceSnippet(textToSlice: string, snippetLength: number) {
	return textToSlice.slice(0, snippetLength) + (textToSlice.length > snippetLength ? '...' : '');
}
