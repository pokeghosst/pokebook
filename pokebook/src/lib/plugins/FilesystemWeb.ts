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

import Dexie, { type EntityTable } from 'dexie';

import type {
	ExistsOptions,
	ExistsResult,
	FileInfo,
	FilesystemFile,
	FilesystemPlugin,
	ReadDirOptions,
	ReadDirResult,
	ReadFileOptions,
	ReadFileResult,
	WriteFileOptions,
	WriteFileResult
} from './FilesystemPlugin';

type DexieFilesystem = Dexie & { files: EntityTable<FilesystemFile, 'path'> };

export class FilesystemWeb implements FilesystemPlugin {
	private _db?: DexieFilesystem;

	private getDb(): DexieFilesystem {
		if (this._db !== undefined) {
			return this._db;
		}

		this._db = new Dexie('PokeBook') as DexieFilesystem;
		this._db.version(1).stores({ files: 'path, content, ctime, mtime' });

		return this._db;
	}
	async exists(options: ExistsOptions): Promise<ExistsResult> {
		const count = await this.getDb().files.where('path').equals(options.path).count();
		return { exists: count > 0 };
	}
	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		const now = Date.now();

		const uri = await this.getDb().files.add(
			{
				content: options.data,
				path: options.path,
				ctime: now,
				mtime: now
			},
			options.path
		);
		return { uri };
	}
	async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		const data = await this.getDb().files.where('path').equals(options.path).first();

		console.log(data);

		if (data?.content) {
			return { data: data.content };
		} else {
			// TODO: Handle properly
			throw new Error('errors.unknown');
		}
	}
	async readDir(options: ReadDirOptions): Promise<ReadDirResult> {
		console.log('files', await this.getDb().files.where('path').startsWith(options.path).toArray());

		const entries = await this.getDb().files.where('path').startsWith(options.path).toArray();

		console.log(entries);

		return {
			entries: entries.map(
				(file) =>
					({
						name: file.path,
						type: 'file',
						ctime: file.ctime,
						mtime: file.mtime,
						uri: file.path
					} as FileInfo)
			)
		};
	}
}
