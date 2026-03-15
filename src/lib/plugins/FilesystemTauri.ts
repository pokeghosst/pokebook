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

/*
	Unimplemented functions are not necessary for PokeBook and come from
	Capacitor API since we rely on their implementation for web filesystem.
	They will eventually be removed and the interface will be simplified
*/
export class FilesystemTauri implements FilesystemPlugin {
	checkPermissions(): Promise<PermissionStatus> {
		throw new Error('Method checkPermissions not implemented.');
	}
	requestPermissions(): Promise<PermissionStatus> {
		throw new Error('Method requestPermissions not implemented.');
	}
	async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		const buffer = await invoke<ArrayBuffer>('read_file', { path: options.path });
		const decoded = new TextDecoder('utf-8').decode(new Uint8Array(buffer));

		console.log('read file... ', decoded);

		return { data: decoded };
	}
	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		console.log('writing file Tauri...');

		const uri = await invoke<string>('write_file', { path: options.path, data: options.data });

		console.log('writeFile uri... ', uri);

		return { uri };
	}
	appendFile(_options: AppendFileOptions): Promise<void> {
		throw new Error('Method appendFile not implemented.');
	}
	async deleteFile(options: DeleteFileOptions): Promise<void> {
		await invoke<void>('delete_file', { path: options.path });
	}
	async mkdir(options: MkdirOptions): Promise<void> {
		await invoke('mkdir', { path: options.path });
	}
	rmdir(_options: RmdirOptions): Promise<void> {
		throw new Error('Method rmdir not implemented.');
	}
	async readdir(options: ReaddirOptions): Promise<ReaddirResult> {
		const filesInDir = await invoke<{ name: string; ctime: number; uri: string }[]>('readdir', {
			path: options.path
		});

		console.log('filesInDir', filesInDir);

		return { files: filesInDir };
	}
	getUri(_options: GetUriOptions): Promise<GetUriResult> {
		throw new Error('Method getUri not implemented.');
	}
	async stat(options: StatOptions): Promise<StatResult> {
		const result = await invoke('is_file_exists', { path: options.path });

		console.log('file stat... ', result);
	}
	async rename(options: RenameOptions): Promise<void> {
		await invoke<void>('rename_file', { from: options.from, to: options.to });
	}
	copy(_options: CopyOptions): Promise<CopyResult> {
		throw new Error('Method copy not implemented.');
	}
}
