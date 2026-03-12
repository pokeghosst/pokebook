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

import { invoke } from '$lib/util/tauri';
import type {
	AppendFileOptions,
	CopyOptions,
	CopyResult,
	DeleteFileOptions,
	FilesystemPlugin,
	GetUriOptions,
	GetUriResult,
	MkdirOptions,
	PermissionStatus,
	ReaddirOptions,
	ReaddirResult,
	ReadFileOptions,
	ReadFileResult,
	RenameOptions,
	RmdirOptions,
	StatOptions,
	StatResult,
	WriteFileOptions,
	WriteFileResult
} from './FilesystemPlugin';

export class FilesystemTauri implements FilesystemPlugin {
	checkPermissions(): Promise<PermissionStatus> {
		throw new Error('Method not implemented.');
	}
	requestPermissions(): Promise<PermissionStatus> {
		throw new Error('Method not implemented.');
	}
	readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		throw new Error('Method not implemented.');
	}
	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		console.log('writing file Tauri...');

		return await invoke('write_file', { path: options.path, data: options.data });
	}
	appendFile(options: AppendFileOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}
	deleteFile(options: DeleteFileOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}
	mkdir(options: MkdirOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}
	rmdir(options: RmdirOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}
	readdir(options: ReaddirOptions): Promise<ReaddirResult> {
		throw new Error('Method not implemented.');
	}
	getUri(options: GetUriOptions): Promise<GetUriResult> {
		throw new Error('Method not implemented.');
	}
	stat(options: StatOptions): Promise<StatResult> {
		throw new Error('Method not implemented.');
	}
	rename(options: RenameOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}
	copy(options: CopyOptions): Promise<CopyResult> {
		throw new Error('Method not implemented.');
	}
}
