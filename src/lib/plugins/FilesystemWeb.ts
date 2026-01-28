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

import type {
	AppendFileOptions,
	CopyOptions,
	CopyResult,
	DeleteFileOptions,
	Directory,
	FilesystemPlugin,
	GetUriOptions,
	GetUriResult,
	MkdirOptions,
	ReaddirOptions,
	ReaddirResult,
	ReadFileOptions,
	ReadFileResult,
	RenameOptions,
	RmdirOptions,
	StatOptions,
	StatResult,
	WriteFileOptions,
	WriteFileResult,
	PermissionStatus
} from './FilesystemPlugin';

import { Encoding } from './FilesystemPlugin';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class FilesystemWeb implements FilesystemPlugin {
	DB_VERSION = 1;
	DB_NAME = 'Disc';

	private _writeCmds: string[] = ['add', 'put', 'delete'];
	private _db?: IDBDatabase;
	static _debug = true;

	async initDb(): Promise<IDBDatabase> {
		if (this._db !== undefined) {
			return this._db;
		}
		if (!('indexedDB' in window)) {
			throw new Error("This browser doesn't support IndexedDB");
		}

		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
			request.onupgradeneeded = FilesystemWeb.doUpgrade;
			request.onsuccess = () => {
				this._db = request.result;
				resolve(request.result);
			};
			request.onerror = () => reject(request.error);
			request.onblocked = () => {
				console.warn('db blocked');
			};
		});
	}

	static doUpgrade(event: IDBVersionChangeEvent): void {
		const eventTarget = event.target as IDBOpenDBRequest;
		const db = eventTarget.result;
		switch (event.oldVersion) {
			case 0:
			case 1:
			default: {
				if (db.objectStoreNames.contains('FileStorage')) {
					db.deleteObjectStore('FileStorage');
				}
				const store = db.createObjectStore('FileStorage', { keyPath: 'path' });
				store.createIndex('by_folder', 'folder');
			}
		}
	}

	async dbRequest(cmd: string, args: any[]): Promise<any> {
		const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
		return this.initDb().then((conn: IDBDatabase) => {
			return new Promise<IDBObjectStore>((resolve, reject) => {
				const tx: IDBTransaction = conn.transaction(['FileStorage'], readFlag);
				const store: any = tx.objectStore('FileStorage');
				const req = store[cmd](...args);
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			});
		});
	}

	async dbIndexRequest(indexName: string, cmd: string, args: [any]): Promise<any> {
		const readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
		return this.initDb().then((conn: IDBDatabase) => {
			return new Promise<IDBObjectStore>((resolve, reject) => {
				const tx: IDBTransaction = conn.transaction(['FileStorage'], readFlag);
				const store: IDBObjectStore = tx.objectStore('FileStorage');
				const index: any = store.index(indexName);
				const req = index[cmd](...args) as any;
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => reject(req.error);
			});
		});
	}

	private getPath(directory: Directory | undefined, uriPath: string | undefined): string {
		const cleanedUriPath = uriPath !== undefined ? uriPath.replace(/^[/]+|[/]+$/g, '') : '';
		let fsPath = '';
		if (directory !== undefined) fsPath += '/' + directory;
		if (uriPath !== '') fsPath += '/' + cleanedUriPath;
		return fsPath;
	}

	async clear(): Promise<void> {
		const conn: IDBDatabase = await this.initDb();
		const tx: IDBTransaction = conn.transaction(['FileStorage'], 'readwrite');
		const store: IDBObjectStore = tx.objectStore('FileStorage');
		store.clear();
	}

	async readFile(options: ReadFileOptions): Promise<ReadFileResult> {
		const path: string = this.getPath(options.directory, options.path);
		// const encoding = options.encoding;

		const entry = (await this.dbRequest('get', [path])) as EntryObj;
		if (entry === undefined) throw Error('File does not exist.');
		return { data: entry.content ? entry.content : '' };
	}

	async writeFile(options: WriteFileOptions): Promise<WriteFileResult> {
		const path: string = this.getPath(options.directory, options.path);
		let data = options.data;
		const encoding = options.encoding;
		const doRecursive = options.recursive;

		const occupiedEntry = (await this.dbRequest('get', [path])) as EntryObj;
		if (occupiedEntry && occupiedEntry.type === 'directory')
			throw Error('The supplied path is a directory.');

		const parentPath = path.substr(0, path.lastIndexOf('/'));

		const parentEntry = (await this.dbRequest('get', [parentPath])) as EntryObj;
		if (parentEntry === undefined) {
			const subDirIndex = parentPath.indexOf('/', 1);
			if (subDirIndex !== -1) {
				const parentArgPath = parentPath.substr(subDirIndex);
				await this.mkdir({
					path: parentArgPath,
					directory: options.directory,
					recursive: doRecursive
				});
			}
		}

		if (!encoding && !(data instanceof Blob)) {
			data = data.indexOf(',') >= 0 ? data.split(',')[1] : data;
			if (!this.isBase64String(data)) throw Error('The supplied data is not valid base64 content.');
		}

		const now = Date.now();
		const pathObj: EntryObj = {
			path: path,
			folder: parentPath,
			type: 'file',
			size: data instanceof Blob ? data.size : data.length,
			ctime: now,
			mtime: now,
			content: data
		};
		await this.dbRequest('put', [pathObj]);
		return {
			uri: pathObj.path
		};
	}

	async appendFile(options: AppendFileOptions): Promise<void> {
		const path: string = this.getPath(options.directory, options.path);
		let data = options.data;
		const encoding = options.encoding;
		const parentPath = path.substr(0, path.lastIndexOf('/'));

		const now = Date.now();
		let ctime = now;

		const occupiedEntry = (await this.dbRequest('get', [path])) as EntryObj;
		if (occupiedEntry && occupiedEntry.type === 'directory')
			throw Error('The supplied path is a directory.');

		const parentEntry = (await this.dbRequest('get', [parentPath])) as EntryObj;
		if (parentEntry === undefined) {
			const subDirIndex = parentPath.indexOf('/', 1);
			if (subDirIndex !== -1) {
				const parentArgPath = parentPath.substr(subDirIndex);
				await this.mkdir({
					path: parentArgPath,
					directory: options.directory,
					recursive: true
				});
			}
		}

		if (!encoding && !this.isBase64String(data))
			throw Error('The supplied data is not valid base64 content.');

		if (occupiedEntry !== undefined) {
			if (occupiedEntry.content instanceof Blob) {
				throw Error('The occupied entry contains a Blob object which cannot be appended to.');
			}

			if (occupiedEntry.content !== undefined && !encoding) {
				data = btoa(atob(occupiedEntry.content) + atob(data));
			} else {
				data = occupiedEntry.content + data;
			}
			ctime = occupiedEntry.ctime;
		}
		const pathObj: EntryObj = {
			path: path,
			folder: parentPath,
			type: 'file',
			size: data.length,
			ctime: ctime,
			mtime: now,
			content: data
		};
		await this.dbRequest('put', [pathObj]);
	}

	async deleteFile(options: DeleteFileOptions): Promise<void> {
		const path: string = this.getPath(options.directory, options.path);

		const entry = (await this.dbRequest('get', [path])) as EntryObj;
		if (entry === undefined) throw Error('File does not exist.');
		const entries = await this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)]);
		if (entries.length !== 0) throw Error('Folder is not empty.');

		await this.dbRequest('delete', [path]);
	}

	async mkdir(options: MkdirOptions): Promise<void> {
		const path: string = this.getPath(options.directory, options.path);
		const doRecursive = options.recursive;
		const parentPath = path.substr(0, path.lastIndexOf('/'));

		const depth = (path.match(/\//g) || []).length;
		const parentEntry = (await this.dbRequest('get', [parentPath])) as EntryObj;
		const occupiedEntry = (await this.dbRequest('get', [path])) as EntryObj;
		if (depth === 1) throw Error('Cannot create Root directory');
		if (occupiedEntry !== undefined) throw Error('Current directory does already exist.');
		if (!doRecursive && depth !== 2 && parentEntry === undefined)
			throw Error('Parent directory must exist');

		if (doRecursive && depth !== 2 && parentEntry === undefined) {
			const parentArgPath = parentPath.substr(parentPath.indexOf('/', 1));
			await this.mkdir({
				path: parentArgPath,
				directory: options.directory,
				recursive: doRecursive
			});
		}
		const now = Date.now();
		const pathObj: EntryObj = {
			path: path,
			folder: parentPath,
			type: 'directory',
			size: 0,
			ctime: now,
			mtime: now
		};
		await this.dbRequest('put', [pathObj]);
	}

	async rmdir(options: RmdirOptions): Promise<void> {
		const { path, directory, recursive } = options;
		const fullPath: string = this.getPath(directory, path);

		const entry = (await this.dbRequest('get', [fullPath])) as EntryObj;

		if (entry === undefined) throw Error('Folder does not exist.');

		if (entry.type !== 'directory') throw Error('Requested path is not a directory');

		const readDirResult = await this.readdir({ path, directory });

		if (readDirResult.files.length !== 0 && !recursive) throw Error('Folder is not empty');

		for (const entry of readDirResult.files) {
			const entryPath = `${path}/${entry.name}`;
			const entryObj = await this.stat({ path: entryPath, directory });
			if (entryObj.type === 'file') {
				await this.deleteFile({ path: entryPath, directory });
			} else {
				await this.rmdir({ path: entryPath, directory, recursive });
			}
		}

		await this.dbRequest('delete', [fullPath]);
	}

	async readdir(options: ReaddirOptions): Promise<ReaddirResult> {
		const path: string = this.getPath(options.directory, options.path);

		const entry = (await this.dbRequest('get', [path])) as EntryObj;
		if (options.path !== '' && entry === undefined) throw Error('Folder does not exist.');

		const entries: string[] = await this.dbIndexRequest('by_folder', 'getAllKeys', [
			IDBKeyRange.only(path)
		]);
		const files = await Promise.all(
			entries.map(async (e) => {
				let subEntry = (await this.dbRequest('get', [e])) as EntryObj;
				if (subEntry === undefined) {
					subEntry = (await this.dbRequest('get', [e + '/'])) as EntryObj;
				}
				return {
					name: e.substring(path.length + 1),
					type: subEntry.type,
					size: subEntry.size,
					ctime: subEntry.ctime,
					mtime: subEntry.mtime,
					uri: subEntry.path
				};
			})
		);
		return { files: files };
	}

	async getUri(options: GetUriOptions): Promise<GetUriResult> {
		const path: string = this.getPath(options.directory, options.path);

		let entry = (await this.dbRequest('get', [path])) as EntryObj;
		if (entry === undefined) {
			entry = (await this.dbRequest('get', [path + '/'])) as EntryObj;
		}
		return {
			uri: entry?.path || path
		};
	}

	async stat(options: StatOptions): Promise<StatResult> {
		const path: string = this.getPath(options.directory, options.path);

		let entry = (await this.dbRequest('get', [path])) as EntryObj;
		if (entry === undefined) {
			entry = (await this.dbRequest('get', [path + '/'])) as EntryObj;
		}
		if (entry === undefined) throw Error('Entry does not exist.');

		return {
			name: entry.path.substring(path.length + 1),
			type: entry.type,
			size: entry.size,
			ctime: entry.ctime,
			mtime: entry.mtime,
			uri: entry.path
		};
	}

	async rename(options: RenameOptions): Promise<void> {
		await this._copy(options, true);
		return;
	}

	async copy(options: CopyOptions): Promise<CopyResult> {
		return this._copy(options, false);
	}

	async requestPermissions(): Promise<PermissionStatus> {
		return { publicStorage: 'granted' };
	}

	async checkPermissions(): Promise<PermissionStatus> {
		return { publicStorage: 'granted' };
	}

	private async _copy(options: CopyOptions, doRename = false): Promise<CopyResult> {
		let { toDirectory } = options;
		const { to, from, directory: fromDirectory } = options;

		if (!to || !from) {
			throw Error('Both to and from must be provided');
		}

		// If no "to" directory is provided, use the "from" directory
		if (!toDirectory) {
			toDirectory = fromDirectory;
		}

		const fromPath = this.getPath(fromDirectory, from);
		const toPath = this.getPath(toDirectory, to);

		// Test that the "to" and "from" locations are different
		if (fromPath === toPath) {
			return {
				uri: toPath
			};
		}

		if (isPathParent(fromPath, toPath)) {
			throw Error('To path cannot contain the from path');
		}

		// Check the state of the "to" location
		let toObj;
		try {
			toObj = await this.stat({
				path: to,
				directory: toDirectory
			});
		} catch (_) {
			// To location does not exist, ensure the directory containing "to" location exists and is a directory
			const toPathComponents = to.split('/');
			toPathComponents.pop();
			const toPath = toPathComponents.join('/');

			// Check the containing directory of the "to" location exists
			if (toPathComponents.length > 0) {
				const toParentDirectory = await this.stat({
					path: toPath,
					directory: toDirectory
				});

				if (toParentDirectory.type !== 'directory') {
					throw new Error('Parent directory of the to path is a file');
				}
			}
		}

		// Cannot overwrite a directory
		if (toObj && toObj.type === 'directory') {
			throw new Error('Cannot overwrite a directory with a file');
		}

		// Ensure the "from" object exists
		const fromObj = await this.stat({
			path: from,
			directory: fromDirectory
		});

		// Set the mtime/ctime of the supplied path
		const updateTime = async (path: string, ctime: number, mtime: number) => {
			const fullPath: string = this.getPath(toDirectory, path);
			const entry = (await this.dbRequest('get', [fullPath])) as EntryObj;
			entry.ctime = ctime;
			entry.mtime = mtime;
			await this.dbRequest('put', [entry]);
		};

		const ctime = fromObj.ctime ? fromObj.ctime : Date.now();

		switch (fromObj.type) {
			// The "from" object is a file
			case 'file': {
				// Read the file
				const file = await this.readFile({
					path: from,
					directory: fromDirectory
				});

				// Optionally remove the file
				if (doRename) {
					await this.deleteFile({
						path: from,
						directory: fromDirectory
					});
				}

				let encoding;
				if (!(file.data instanceof Blob) && !this.isBase64String(file.data)) {
					encoding = Encoding.UTF8;
				}

				// Write the file to the new location
				const writeResult = await this.writeFile({
					path: to,
					directory: toDirectory,
					data: file.data,
					encoding: encoding
				});

				// Copy the mtime/ctime of a renamed file
				if (doRename) {
					await updateTime(to, ctime, fromObj.mtime);
				}

				// Resolve promise
				return writeResult;
			}
			case 'directory': {
				if (toObj) {
					throw Error('Cannot move a directory over an existing object');
				}

				try {
					// Create the to directory
					await this.mkdir({
						path: to,
						directory: toDirectory,
						recursive: false
					});

					// Copy the mtime/ctime of a renamed directory
					if (doRename) {
						await updateTime(to, ctime, fromObj.mtime);
					}
				} catch (_) {
					// ignore
				}

				// Iterate over the contents of the from location
				const contents = (
					await this.readdir({
						path: from,
						directory: fromDirectory
					})
				).files;

				for (const filename of contents) {
					// Move item from the from directory to the to directory
					await this._copy(
						{
							from: `${from}/${filename.name}`,
							to: `${to}/${filename.name}`,
							directory: fromDirectory,
							toDirectory
						},
						doRename
					);
				}

				// Optionally remove the original from directory
				if (doRename) {
					await this.rmdir({
						path: from,
						directory: fromDirectory
					});
				}
			}
		}
		return {
			uri: toPath
		};
	}

	private isBase64String(str: string): boolean {
		try {
			return btoa(atob(str)) == str;
		} catch (_) {
			return false;
		}
	}
}

function resolve(path: string): string {
	const posix = path.split('/').filter((item) => item !== '.');
	const newPosix: string[] = [];

	posix.forEach((item) => {
		if (item === '..' && newPosix.length > 0 && newPosix[newPosix.length - 1] !== '..') {
			newPosix.pop();
		} else {
			newPosix.push(item);
		}
	});

	return newPosix.join('/');
}

function isPathParent(parent: string, children: string): boolean {
	parent = resolve(parent);
	children = resolve(children);
	const pathsA = parent.split('/');
	const pathsB = children.split('/');

	return parent !== children && pathsA.every((value, index) => value === pathsB[index]);
}

interface EntryObj {
	path: string;
	folder: string;
	type: 'directory' | 'file';
	size: number;
	ctime: number;
	mtime: number;
	uri?: string;
	content?: string | Blob;
}
