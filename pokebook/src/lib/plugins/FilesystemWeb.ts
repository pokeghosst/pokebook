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

import database from './DexieManager';

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

export class FilesystemWeb implements FilesystemPlugin {
	async exists(options: ExistsOptions): Promise<ExistsResult> {
		const count = await database.files.where('path').equals(`/${options.path}`).count();
		return { exists: count > 0 };
	}
	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		const now = Date.now();

		const uri = await database.files.put(
			{
				content: options.data,
				path: `${options.path}`,
				ctime: now,
				mtime: now
			},
			options.path
		);
		return { uri };
	}
	async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		const entry = await database.files.where('path').equals(options.path).first();

		if (!entry) throw new Error('File does not exist!');

		return { data: entry.content };
	}
	async deleteFile(options: DeleteFileOptions): Promise<void> {
		await database.files.delete(options.path);
	}
	async readDir(options: ReadDirOptions): Promise<ReadDirResult> {
		const entries = await database.files.where('path').startsWith(`${options.path}`).toArray();

		return {
			entries: entries.map(
				(file) =>
					({
						name: file.path.split('/').pop(),
						type: 'file',
						ctime: file.ctime,
						mtime: file.mtime,
						uri: file.path
					}) as FileInfo
			)
		};
	}
	async rename(options: RenameOptions): Promise<void> {
		if (options.from === options.to) return;

		const entry = await database.files.where('path').equals(options.from).first();

		if (!entry) throw new Error('File does not exist!');

		await database.files.delete(options.from);

		await database.files.add({
			...entry,
			path: options.to
		});
	}
}
