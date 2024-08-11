export enum StorageProvider {
	// TODO
	// DROPBOX = 'dropbox',
	GOOGLE = 'google',
	LOCAL = 'local'
}

export function isStorageProvider(value: string): boolean {
	return Object.values(StorageProvider).includes(value as StorageProvider);
}
