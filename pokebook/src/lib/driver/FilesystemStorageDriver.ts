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

import { homeDir } from '@tauri-apps/api/path';
import {
	BaseDirectory,
	exists,
	mkdir,
	readDir,
	readTextFile,
	remove,
	rename,
	writeTextFile
} from '@tauri-apps/plugin-fs';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

import type { PoemEntity } from '../types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

async function checkFolderAndCreateIfMissing() {
	const tokenExists = await exists('PokeBook', {
		baseDir: BaseDirectory.Home
	});

	if (!tokenExists)
		await mkdir('PokeBook', {
			baseDir: BaseDirectory.Home
		});
}

function withFolderCheck<This, Args extends unknown[], R>(
	fn: (this: This, ...args: Args) => Promise<R>
): (this: This, ...args: Args) => Promise<R> {
	return async function (this: This, ...args: Args): Promise<R> {
		await checkFolderAndCreateIfMissing();
		return await fn.apply(this, args);
	};
}

export const FilesystemStorageDriver: IPoemStorageDriver = {
	listPoems: withFolderCheck(async function () {
		return (await readDir('PokeBook', { baseDir: BaseDirectory.Home }))
			.map((file) => ({
				name: file.name.split('_')[0],
				poemUri: `PokeBook/${file.name}`,
				timestamp: parseInt(file.name.split('_')[1].split('.xml')[0])
			}))
			.sort((a, b) => b.timestamp - a.timestamp);
	}),
	loadPoem: withFolderCheck(async function (poemUri: string) {
		return new XMLParser().parse(
			await readTextFile(poemUri, {
				baseDir: BaseDirectory.Home
			})
		);
	}),
	savePoem: withFolderCheck(async function (poem: PoemEntity) {
		const timestamp = Date.now();
		const filePath = `PokeBook/${poem.name}_${timestamp}.xml`;

		await writeTextFile(filePath, new XMLBuilder({ format: true }).build(poem), {
			baseDir: BaseDirectory.Home
		});

		return {
			id: (await homeDir()).concat(`/${filePath}`),
			timestamp
		};
	}),
	updatePoem: withFolderCheck(async function (poem: PoemEntity, poemUri: string) {
		await writeTextFile(poemUri, new XMLBuilder({ format: true }).build(poem), {
			baseDir: BaseDirectory.Home
		});

		const timestamp = poemUri.split('PokeBook/')[1].split(/_|\.xml/)[1];
		const newFileUri = `PokeBook/${poem.name}_${timestamp}.xml`;
		await rename(poemUri, newFileUri, {
			oldPathBaseDir: BaseDirectory.Home,
			newPathBaseDir: BaseDirectory.Home
		});

		return newFileUri;
	}),
	deletePoem: withFolderCheck(async function (poemUri: string) {
		await remove(poemUri, { baseDir: BaseDirectory.Home });
	})
};
