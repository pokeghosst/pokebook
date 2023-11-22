import { Filesystem, Encoding } from '@capacitor/filesystem';

export async function getFileContentsAsString(uri: string) {
	return (
		await Filesystem.readFile({
			path: uri,
			encoding: Encoding.UTF8
		})
	).data.toString();
}
