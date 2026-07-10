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

import { invoke, invokeWithThrow } from '$lib/util/tauri';
import type {
	DeleteFileOptions,
	FilesystemPlugin,
	ReaddirOptions,
	ReaddirResult,
	ReadFileOptions,
	ReadFileResult,
	RenameOptions,
	StatOptions,
	StatResult,
	WriteFileOptions,
	WriteFileResult,
	FileInfo
} from './FilesystemPlugin';

export class FilesystemTauri implements FilesystemPlugin {
	async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		const buffer = await invokeWithThrow<ArrayBuffer>('read_file', { path: options.path });
		const decoded = new TextDecoder('utf-8').decode(new Uint8Array(buffer));

		return { data: decoded };
	}
	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		const uri = await invokeWithThrow<string>('write_file', {
			path: options.path,
			data: options.data
		});

		return { uri };
	}
	async deleteFile(options: DeleteFileOptions): Promise<void> {
		await invokeWithThrow<void>('delete_file', { path: options.path });
	}
	async readdir(options: ReaddirOptions): Promise<ReaddirResult> {
		const files = await invokeWithThrow<FileInfo[]>('readdir', {
			path: options.path
		});

		return { files };
	}
	async stat(options: StatOptions): Promise<StatResult> {
		return await invokeWithThrow<FileInfo>('stat', { path: options.path });
	}
	async rename(options: RenameOptions): Promise<void> {
		await invokeWithThrow<void>('rename_file', { from: options.from, to: options.to });
	}
}
