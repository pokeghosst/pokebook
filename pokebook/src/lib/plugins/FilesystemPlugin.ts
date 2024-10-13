export interface FilesystemPlugin {
	exists(options: ExistsOptions): Promise<ExistsResult>;
	writeFile(options: WriteFileOptions): Promise<WriteFileResult>;
	readFile(options: ReadFileOptions): Promise<ReadFileResult>;
	readDir(options: ReadDirOptions): Promise<ReadDirResult>;
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
	mtime: number;
	uri: string;
}
