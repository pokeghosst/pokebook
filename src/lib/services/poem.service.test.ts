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

import type { ManifestRecord } from '$lib/schema/manifest.schema';
import type { Poem } from '$lib/schema/poem.schema';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Filesystem, type FileInfo } from '../plugins/Filesystem';
import { isPathExists } from '../util/filesystem';
import {
	deleteManifestEntry,
	getManifestEntries,
	updateManifestEntry,
	writeToManifest
} from './manifest.service';
import { deletePoem, getPoem, listPoems, savePoem, updatePoem } from './poem.service';

vi.mock('../plugins/Filesystem');
vi.mock('../util/filesystem');
vi.mock('./manifest.service', () => ({
	writeToManifest: vi.fn(),
	getManifestEntries: vi.fn(),
	updateManifestEntry: vi.fn(),
	deleteManifestEntry: vi.fn()
}));

const FILESYSTEM_DIR = '/DOCUMENTS/poems';

const manifestFile: FileInfo = {
	name: 'poems_local.json',
	type: 'file',
	size: 206,
	ctime: 1775030103018,
	mtime: 1775030103018,
	uri: `${FILESYSTEM_DIR}/poems_local.json`
};
const poemFile1: FileInfo = {
	name: 'Unnamed1_1774957833661.xml',
	type: 'file',
	size: 67,
	ctime: 1774958154768,
	mtime: 1774958154768,
	uri: `${FILESYSTEM_DIR}/Unnamed1_1774957833661.xml`
};
const poemFile2: FileInfo = {
	name: 'Unnamed2_1775030102979.xml',
	type: 'file',
	size: 66,
	ctime: 1775030103011,
	mtime: 1775030103011,
	uri: `${FILESYSTEM_DIR}Unnamed2_1775030102979.xml`
};
const entry1: ManifestRecord = {
	id: `${FILESYSTEM_DIR}/Unnamed1_100.xml`,
	poemSnippet: 'Lorem ipsum dolor...'
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('listPoems', () => {
	it('should return empty array when poem directory missing', async () => {
		vi.mocked(isPathExists).mockResolvedValue(false);

		expect(await listPoems()).toEqual([]);
	});

	it('should exclude .json files', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readdir).mockResolvedValue({ files: [manifestFile, poemFile1] });
		vi.mocked(getManifestEntries).mockResolvedValue([
			{ id: `${FILESYSTEM_DIR}/${poemFile1.name}`, poemSnippet: 'POEM 1 snippet...' }
		]);

		const result = await listPoems();
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Unnamed1');
	});

	it('should build poem meta object from manifest', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readdir).mockResolvedValue({ files: [manifestFile, poemFile1] });
		vi.mocked(getManifestEntries).mockResolvedValue([
			{ id: `${FILESYSTEM_DIR}/${poemFile1.name}`, poemSnippet: 'POEM 1 snippet...' }
		]);

		const [file] = await listPoems();

		expect(file).toStrictEqual({
			id: '/DOCUMENTS/poems/Unnamed1_1774957833661.xml',
			name: 'Unnamed1',
			timestamp: 1774958154768,
			unsavedChanges: false,
			poemSnippet: 'POEM 1 snippet...'
		});
	});

	it('should fall back to mtime if ctime is missing', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readdir).mockResolvedValue({
			files: [manifestFile, { ...poemFile1, ctime: undefined }]
		});
		vi.mocked(getManifestEntries).mockResolvedValue([
			{ id: `${FILESYSTEM_DIR}/${poemFile1.name}`, poemSnippet: 'POEM 1 snippet...' }
		]);

		const [file] = await listPoems();
		expect(file.timestamp).toBe(1774958154768);
	});

	it('should sort by timestamp descending', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readdir).mockResolvedValue({
			files: [manifestFile, poemFile1, poemFile2]
		});
		vi.mocked(getManifestEntries).mockResolvedValue([
			{ id: `${FILESYSTEM_DIR}/${poemFile1.name}`, poemSnippet: 'POEM 1 snippet...' },
			{ id: `${FILESYSTEM_DIR}/${poemFile2.name}`, poemSnippet: 'POEM 2 snippet...' }
		]);

		const files = await listPoems();

		expect(files[0].name).toBe('Unnamed2');
		expect(files[1].name).toBe('Unnamed1');
	});
});

describe('getPoem', () => {
	it('should parse well-formed poem file', async () => {
		vi.mocked(Filesystem.readFile).mockResolvedValue({
			data: '<name>foo</name>\n<text>bar</text>\n<note>baz</note>\n'
		});

		const poem = await getPoem('foo.xml');
		expect(poem).toStrictEqual({ name: 'foo', text: 'bar', note: 'baz' });
	});

	it('should throw on non-XML poem file', async () => {
		vi.mocked(Filesystem.readFile).mockResolvedValue({
			data: '{name: "foo", text: "bar", note: "baz"}'
		});

		await expect(getPoem('foo.xml')).rejects.toThrow('The file is not a poem.');
	});

	it('should throw on malformed poem file', async () => {
		vi.mocked(Filesystem.readFile).mockResolvedValue({
			data: '<name>foo</name>\n<text>bar</text>'
		});

		await expect(getPoem('foo.xml')).rejects.toThrow('The file is not a poem.');
	});
});

describe('savePoem', () => {
	const poem: Poem = { name: 'Unnamed3', text: 'poem contents', note: 'note contents' };

	beforeEach(() => {
		vi.mocked(Filesystem.writeFile).mockResolvedValue({
			uri: `${FILESYSTEM_DIR}/Unnamed3_100.xml`
		});
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should form file name correctly', async () => {
		await savePoem(poem, 300);

		expect(Filesystem.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `poems/${poem.name}_300.xml`
			})
		);
	});

	it('should set current time if no timestamp specified', async () => {
		vi.setSystemTime(1000);

		await savePoem(poem);

		expect(Filesystem.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				path: `poems/${poem.name}_1000.xml`
			})
		);
	});

	it('should form XML contents correctly', async () => {
		await savePoem(poem, 100);

		expect(Filesystem.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				data: `<name>Unnamed3</name>
<text>poem contents</text>
<note>note contents</note>
`
			})
		);
	});

	it('should append new manifest entry', async () => {
		vi.mocked(getManifestEntries).mockResolvedValue([entry1]);

		await savePoem(poem, 100);

		expect(writeToManifest).toHaveBeenCalledWith([
			entry1,
			{
				id: `${FILESYSTEM_DIR}/Unnamed3_100.xml`,
				poemSnippet: 'poem contents'
			}
		]);
	});

	it('should truncate poem snippet with ellipsis if >128 chars', async () => {
		const text = 'a'.repeat(200);

		await savePoem({ ...poem, text });

		expect(writeToManifest).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					poemSnippet: 'a'.repeat(128) + '...'
				})
			])
		);
	});

	it('should not truncate poem snippet if <128 chars', async () => {
		await savePoem(poem);

		expect(writeToManifest).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					poemSnippet: poem.text
				})
			])
		);
	});
});

describe('updatePoem', () => {
	const poem: Poem = { name: 'Unnamed4', text: 'poem contents', note: 'note contents' };
	const uri = `${FILESYSTEM_DIR}/Unnamed4_100.xml`;

	it('should rename file when poem name changes', async () => {
		const newUri = `${FILESYSTEM_DIR}/Unnamed5_100.xml`;
		const newPoem = { ...poem, name: 'Unnamed5' };

		const result = await updatePoem(uri, newPoem);

		expect(Filesystem.rename).toHaveBeenCalledWith(
			expect.objectContaining({
				from: uri,
				to: newUri
			})
		);
		expect(result).toBe(newUri);
	});

	it('should not rename when poem name not changed', async () => {
		await updatePoem(uri, poem);

		expect(Filesystem.rename).not.toHaveBeenCalled();
	});

	it('should update manifest record', async () => {
		const newUri = `${FILESYSTEM_DIR}/Unnamed5_100.xml`;
		const newPoem = { ...poem, name: 'Unnamed5' };

		await updatePoem(uri, newPoem);

		expect(updateManifestEntry).toHaveBeenCalledWith(uri, { id: newUri, poemSnippet: poem.text });
	});
});

describe('deletePoem', () => {
	const uri = `${FILESYSTEM_DIR}/Unnamed5_100.xml`;

	it('should delete file with given uri', async () => {
		await deletePoem(uri);

		expect(Filesystem.deleteFile).toHaveBeenCalledWith(expect.objectContaining({ path: uri }));
	});

	it('should remove the manifest entry for the given uri', async () => {
		await deletePoem(uri);

		expect(deleteManifestEntry).toHaveBeenCalledWith(uri);
	});
});
