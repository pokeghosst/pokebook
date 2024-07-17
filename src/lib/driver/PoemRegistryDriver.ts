/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024 Pokeghost.

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

import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

interface PoemBufferRecord {
	id: string;
	name: string;
	timestamp: number;
	unsavedChanges: boolean;
	poemSnippet: string;
}

async function addPoemRecord(recordToSave: PoemBufferRecord) {
	let poemRegistryFile: string;

	try {
		poemRegistryFile = await getPoemRegistry();
	} catch (e: any) {
		await initPoemRegistry();
		poemRegistryFile = await getPoemRegistry();
	}

	const poemRegistry = JSON.parse(poemRegistryFile);

	await writeToRegistry(JSON.stringify(poemRegistry.concat(recordToSave)));
}

async function getPoemRegistry() {
	return (
		await Filesystem.readFile({
			directory: Directory.Documents,
			path: 'poems/poems.json'
		})
	).data.toString();
}

async function initPoemRegistry() {
	await writeToRegistry('[]');
}

async function writeToRegistry(data: string) {
	await Filesystem.writeFile({
		directory: Directory.Documents,
		path: 'poems/poems.json',
		encoding: Encoding.UTF8,
		recursive: true,
		data: data
	});
}

export { addPoemRecord, getPoemRegistry };
