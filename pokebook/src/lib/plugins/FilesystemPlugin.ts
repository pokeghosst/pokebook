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

export interface FilesystemPlugin {
	exists(options: ExistsOptions): Promise<ExistsResult>;
	writeFile(options: WriteFileOptions): Promise<WriteFileResult>;
	readFile(options: ReadFileOptions): Promise<ReadFileResult>;
	deleteFile(options: DeleteFileOptions): Promise<void>;
	readDir(options: ReadDirOptions): Promise<ReadDirResult>;
	rename(options: RenameOptions): Promise<void>;
}

export interface ExistsOptions {
	path: string;
}

export interface ExistsResult {
	exists: boolean;
}

export interface WriteFileOptions {
	path: string;
	data: string;
}

export interface WriteFileResult {
	uri: string;
}

export interface ReadFileOptions {
	path: string;
}

export interface DeleteFileOptions {
	path: string;
}

export interface RenameOptions {
	from: string;
	to: string;
}

export interface ReadFileResult {
	data: string;
}

export interface FilesystemFile {
	content: string;
	path: string;
	ctime: number;
	mtime: number;
}

export interface ReadDirOptions {
	path: string;
}

export interface ReadDirResult {
	entries: FileInfo[];
}

export interface FileInfo {
	name: string;
	type: 'file' | 'dir';
	ctime: number;
	mtime: number | null; // TODO: Check. Maybe we don't need mtime altogether and this is just a Capacitor legacy
	uri: string;
}
