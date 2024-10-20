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
