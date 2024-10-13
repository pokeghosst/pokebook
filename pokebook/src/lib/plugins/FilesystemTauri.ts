class FilesystemTauri implements FilesystemPlugin {
	exists(path: string): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	async writeFile(path: string, data: string): Promise<WriteFileResult> {
		await writeTextFile(path, data, {
			baseDir: BaseDirectory.Home
		});
	}
	readFile(path: string): Promise<string> {
		throw new Error('Method not implemented.');
	}
}
