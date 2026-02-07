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

import { Directory, Encoding, Filesystem } from '../plugins/Filesystem';
import type { ManifestRecord, PoemMeta } from '../schema/manifest.schema';
import { isPathExists } from '../util/filesystem';

export async function writeToManifest(manifest: ManifestRecord[]): Promise<void> {
	await Filesystem.writeFile({
		path: `poems/poems_local.json`,
		data: JSON.stringify(manifest),
		directory: Directory.Documents,
		encoding: Encoding.UTF8,
		recursive: true
	});
}

export async function getManifestEntries(): Promise<PoemMeta[]> {
	if (!(await isPathExists('poems/')) || !(await isPathExists('poems/poems_local.json'))) return [];

	const manifestFile = await Filesystem.readFile({
		path: `poems/poems_local.json`,
		directory: Directory.Documents,
		encoding: Encoding.UTF8
	});

	try {
		return JSON.parse(manifestFile.data.toString());
	} catch (_) {
		console.warn('Could not parse manifest');

		return [];
	}
}

export async function updateManifestEntry(uri: string, newEntry: ManifestRecord): Promise<void> {
	const manifestEntries = await getManifestEntries();

	const savedManifest = manifestEntries.find((p) => p.id === uri);

	if (savedManifest) {
		const changedPoemManifest = { ...savedManifest, ...newEntry };
		await writeToManifest(manifestEntries.map((p) => (p.id === uri ? changedPoemManifest : p)));
	} else {
		await writeToManifest([...manifestEntries, newEntry]);
	}
}

export async function deleteManifestEntry(uri: string) {
	const manifestEntries = await getManifestEntries();

	await writeToManifest(manifestEntries.filter((p) => p.id !== uri));
}
