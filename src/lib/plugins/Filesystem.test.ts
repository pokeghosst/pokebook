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

import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Directory, Encoding } from './Filesystem';
import { FilesystemWeb } from './FilesystemWeb';

let fs: FilesystemWeb;

async function writeFile(path: string, contents: string) {
	return await fs.writeFile({
		path,
		data: contents,
		directory: Directory.Documents,
		encoding: Encoding.UTF8,
		recursive: true
	});
}

async function getFile(path: string) {
	return await fs.readFile({ path, encoding: Encoding.UTF8 });
}

async function readdir(path: string) {
	return await fs.readdir({ path, directory: Directory.Documents });
}

describe('filesystem', () => {
	beforeEach(() => {
		vi.stubGlobal('indexedDB', new IDBFactory());
		vi.stubGlobal('IDBKeyRange', IDBKeyRange);
		fs = new FilesystemWeb();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('should save and read file', async () => {
		const { uri } = await writeFile('bar.xml', 'foobar');
		const { data } = await getFile(uri);

		expect(data).toBe('foobar');
	});
	it('should override file', async () => {
		await writeFile('bar.xml', 'foobar');
		const { uri } = await writeFile('bar.xml', 'barbaz');
		const { data } = await getFile(uri);

		expect(data).toBe('barbaz');
	});
	it('should throw when reading deleted file', async () => {
		const { uri } = await writeFile('bar.xml', 'foobar');

		await fs.deleteFile({ path: uri });

		await expect(getFile(uri)).rejects.toThrow('File does not exist.');
	});
	it('should throw when reading non-existing file', async () => {
		await expect(getFile('random.xml')).rejects.toThrow('File does not exist.');
	});
	it('should read existing directory', async () => {
		await writeFile('foo/bar.xml', 'foobar');
		const { files } = await readdir('foo');

		expect(files[0].name).toBe('bar.xml');
	});
	it('should throw when reading non-existing directory', async () => {
		await expect(readdir('foo')).rejects.toThrow('Folder does not exist.');
	});
	it('should rename file correctly', async () => {
		const { uri } = await writeFile('foo/bar.xml', 'foobar');
		const newUri = uri.replace('bar', 'xaf');

		await fs.rename({ from: uri, to: newUri });
		const { data } = await getFile(newUri);

		expect(data).toBe('foobar');
	});
});
