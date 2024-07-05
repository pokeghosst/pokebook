import { Directory, Filesystem } from '@capacitor/filesystem';

export const BufferedPoemDriver = {
	listBufferedPoems: async function () {
		const bufferDirFiles = (
			await Filesystem.readdir({
				path: 'poemBuffer/',
				directory: Directory.Documents
			})
		).files;
		const bufferedPoemFiles = bufferDirFiles.map((file) => {
			return {
				name: file.name.split('_')[0].replace(/%20/g, ' '),
				poemUri: file.uri,
				timestamp: file.ctime ?? file.mtime
			};
		});
		console.log(bufferedPoemFiles);
	}
};
