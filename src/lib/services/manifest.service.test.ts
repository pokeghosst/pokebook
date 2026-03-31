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

import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../plugins/Filesystem');
vi.mock('../util/filesystem');

import { Filesystem, Directory, Encoding } from '../plugins/Filesystem';
import { isPathExists } from '../util/filesystem';
import type { ManifestRecord } from '$lib/schema/manifest.schema';
import { getManifestEntries, updateManifestEntry, writeToManifest } from './manifest.service';

const MANIFEST_PATH = 'poems/poems_local.json';

const manifestRecord1: ManifestRecord = {
	id: '/DOCUMENTS/poems/Unnamed1_100.xml',
	poemSnippet: 'Lorem ipsum dolor...'
};
const manifestRecord2: ManifestRecord = {
	id: '/DOCUMENTS/poems/Unnamed2_100.xml',
	poemSnippet: 'Gorpcore pabst cray, hammock...'
};

beforeEach(() => {
	vi.clearAllMocks();
});

describe('writeToManifest', () => {
	it('should serialize the manifest and write it to file', async () => {
		vi.mocked(Filesystem.writeFile).mockResolvedValue({ uri: MANIFEST_PATH });

		await writeToManifest([manifestRecord1, manifestRecord2]);

		expect(Filesystem.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				path: MANIFEST_PATH,
				data: JSON.stringify([manifestRecord1, manifestRecord2]),
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
				recursive: true
			})
		);
	});
});

describe('getManifestEntries', () => {
	it('should return empty array if poem directory is not created', async () => {
		vi.mocked(isPathExists).mockResolvedValue(false);

		expect(await getManifestEntries()).toEqual([]);
		expect(Filesystem.readFile).not.toHaveBeenCalled();
	});

	it('should return empty array if manifest is missing', async () => {
		vi.mocked(isPathExists).mockResolvedValueOnce(true).mockResolvedValueOnce(false);

		expect(await getManifestEntries()).toEqual([]);
	});

	it('should return empty array with a warning for corrupted manifest', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readFile).mockResolvedValue({ data: 'foobar' });
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		expect(await getManifestEntries()).toEqual([]);
		expect(warn).toHaveBeenCalledWith('Could not parse manifest');
	});

	it('should return parsed entries from well-formed manifest', async () => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.readFile).mockResolvedValue({
			data: JSON.stringify([manifestRecord1, manifestRecord2])
		});

		expect(await getManifestEntries()).toEqual([manifestRecord1, manifestRecord2]);
	});
});

describe('updateManifestEntry', () => {
	beforeEach(() => {
		vi.mocked(isPathExists).mockResolvedValue(true);
		vi.mocked(Filesystem.writeFile).mockResolvedValue({ uri: `/DOCUMENTS/${MANIFEST_PATH}` });
	});

	it('should merge changes into existing record', async () => {
		vi.mocked(Filesystem.readFile).mockResolvedValue({
			data: JSON.stringify([manifestRecord1, manifestRecord2])
		});

		await updateManifestEntry(manifestRecord1.id, { ...manifestRecord1, poemSnippet: 'foobar...' });

		expect(Filesystem.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				data: JSON.stringify([{ ...manifestRecord1, poemSnippet: 'foobar...' }, manifestRecord2])
			})
		);
	});
});
