/*
Parts of the implementation are taken and adapted from ionic-team/capacitor-filesystem
https://github.com/ionic-team/capacitor-filesystem/
Copyright (c) 2025 Ionic
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Additions and modifications are licensed under the terms of GNU Affero
General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
*/

export interface FilesystemPlugin {
	checkPermissions(): Promise<PermissionStatus>;
	requestPermissions(): Promise<PermissionStatus>;
	readFile(options: ReadFileOptions): Promise<ReadFileResult>;
	writeFile(options: WriteFileOptions): Promise<WriteFileResult>;
	appendFile(options: AppendFileOptions): Promise<void>;
	deleteFile(options: DeleteFileOptions): Promise<void>;
	mkdir(options: MkdirOptions): Promise<void>;
	rmdir(options: RmdirOptions): Promise<void>;
	readdir(options: ReaddirOptions): Promise<ReaddirResult>;
	getUri(options: GetUriOptions): Promise<GetUriResult>;
	stat(options: StatOptions): Promise<StatResult>;
	rename(options: RenameOptions): Promise<void>;
	copy(options: CopyOptions): Promise<CopyResult>;
}

export interface PermissionStatus {
	publicStorage: PermissionState;
}

export enum Directory {
	Documents = 'DOCUMENTS',
	Data = 'DATA',
	Library = 'LIBRARY',
	Cache = 'CACHE',
	External = 'EXTERNAL',
	ExternalStorage = 'EXTERNAL_STORAGE',
	ExternalCache = 'EXTERNAL_CACHE',
	LibraryNoCloud = 'LIBRARY_NO_CLOUD',
	Temporary = 'TEMPORARY'
}

export enum Encoding {
	UTF8 = 'utf8',
	ASCII = 'ascii',
	UTF16 = 'utf16'
}

export interface FileInfo {
	name: string;
	type: 'directory' | 'file';
	size: number;
	ctime?: number;
	mtime: number;
	uri: string;
}

export interface ReadFileOptions {
	path: string;
	directory?: Directory;
	encoding?: Encoding;
	offset?: number;
	length?: number;
}

export interface ReadFileResult {
	data: string | Blob;
}

export interface WriteFileOptions {
	path: string;
	data: string | Blob;
	directory?: Directory;
	encoding?: Encoding;
	recursive?: boolean;
}

export interface WriteFileResult {
	uri: string;
}

export interface AppendFileOptions {
	path: string;
	data: string;
	directory?: Directory;
	encoding?: Encoding;
}

export interface DeleteFileOptions {
	path: string;
	directory?: Directory;
}

export interface MkdirOptions {
	path: string;
	directory?: Directory;
	recursive?: boolean;
}

export interface RmdirOptions {
	path: string;
	directory?: Directory;
	recursive?: boolean;
}

export interface ReaddirOptions {
	path: string;
	directory?: Directory;
}

export interface ReaddirResult {
	files: FileInfo[];
}

export interface GetUriOptions {
	path: string;
	directory: Directory;
}

export interface GetUriResult {
	uri: string;
}

export interface StatOptions {
	path: string;
	directory?: Directory;
}

export type StatResult = FileInfo;

export type RenameOptions = CopyOptions;

export interface CopyOptions {
	from: string;
	to: string;
	directory?: Directory;
	toDirectory?: Directory;
}

export interface CopyResult {
	uri: string;
}
