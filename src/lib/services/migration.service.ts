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

import { Directory, Filesystem } from '$lib/plugins/Filesystem';
import { getManifestEntries, writeManifest } from './manifest.service';
import { getPoem, sliceSnippet } from './poem.service';

const UUID_FILENAME =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.xml$/i;

function isUuidFilename(name: string): boolean {
	return UUID_FILENAME.test(name);
}

export async function runMigrations() {
	const files = (
		await Filesystem.readdir({
			path: 'poems',
			directory: Directory.Documents
		})
	).files;

	console.log(files);

	const legacyFiles = files.filter(
		(file) => file.name.endsWith('.xml') && !isUuidFilename(file.name)
	);

	if (legacyFiles.length === 0) {
		return;
	}

	const manifest = await getManifestEntries();

	for (const file of legacyFiles) {
		const id = crypto.randomUUID();

		const newPath = `poems/${id}.xml`;

		await Filesystem.rename({
			from: file.uri,
			to: '/DOCUMENTS/' + newPath
		});

		const manifestEntry = manifest.find((entry) => entry.id === id);

		if (!manifestEntry) {
			const poem = await getPoem(id);

			manifest.push({
				id,
				snippet: sliceSnippet(poem.text, 128),
				mtime: file.mtime,
				size: file.size
			});
		}
	}

	await writeManifest(manifest);
}
