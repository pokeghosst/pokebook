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

import type {
	DeleteFileOptions,
	ExistsOptions,
	ExistsResult,
	FileInfo,
	FilesystemPlugin,
	ReadDirOptions,
	ReadDirResult,
	ReadFileOptions,
	ReadFileResult,
	RenameOptions,
	WriteFileOptions,
	WriteFileResult
} from './FilesystemPlugin';

const POKEBOOK_DIR = 'PokeBook';

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

export class FilesystemTauri implements FilesystemPlugin {
	exists = withFolderCheck(async (options: ExistsOptions): Promise<ExistsResult> => {
		return { exists: await exists(POKEBOOK_DIR + options.path, { baseDir: BaseDirectory.Home }) };
	});
	writeFile = withFolderCheck(async (options: WriteFileOptions): Promise<WriteFileResult> => {
		await writeTextFile(POKEBOOK_DIR + options.path, options.data, { baseDir: BaseDirectory.Home });

		return { uri: options.path };
	});
	readFile = withFolderCheck(async (options: ReadFileOptions): Promise<ReadFileResult> => {
		return {
			data: await readTextFile(POKEBOOK_DIR + options.path, { baseDir: BaseDirectory.Home })
		};
	});
	deleteFile = withFolderCheck(async (options: DeleteFileOptions): Promise<void> => {
		await remove(POKEBOOK_DIR + options.path, { baseDir: BaseDirectory.Home });
	});
	readDir = withFolderCheck(async (options: ReadDirOptions): Promise<ReadDirResult> => {
		const entries = await readDir(POKEBOOK_DIR + options.path, { baseDir: BaseDirectory.Home });
		const poemFiles: FileInfo[] = entries.map((entry) => ({
			name: entry.name.split('_')[0],
			type: 'file',
			ctime: parseInt(entry.name.split('_')[1].split('.xml')[0]),
			mtime: null,
			uri: `PokeBook/${entry.name}`
		}));

		return { entries: poemFiles };
	});
	rename = withFolderCheck(async (options: RenameOptions): Promise<void> => {
		await rename(POKEBOOK_DIR + options.from, POKEBOOK_DIR + options.to, {
			oldPathBaseDir: BaseDirectory.Home,
			newPathBaseDir: BaseDirectory.Home
		});
	});
}
