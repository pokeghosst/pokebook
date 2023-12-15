import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { getFileContentsAsString } from '../util/filesystemUtil';
import type { Poem } from '../types/Poem';
import type { PoemFile } from '../types/PoemFile';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

export const PoemLocalStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		const storedFiles = (
			await Filesystem.readdir({
				path: 'poems',
				directory: Directory.Data
			})
		).files;
		const poemFiles: PoemFile[] = [];
		storedFiles.forEach((file) => {
			if (file.name.indexOf('_note.txt') === -1) {
				poemFiles.push({
					name: file.name.split('_')[0].replace(/%20/g, ' '),
					poemUri: file.uri,
					noteUri: file.uri.replace(/(\.txt)$/, '_note$1'),
					// ctime is not available on Android 7 and older devices.
					// The app targets SDK 33 (Android 13) so this fallback is pretty much just to silence the error
					timestamp: file.ctime ?? file.mtime
				});
			}
		});
		return poemFiles.sort((a, b) => b.timestamp - a.timestamp);
	},
	loadPoem: async function (poemFile: PoemFile) {
		return {
			poem: {
				name: poemFile.name,
				body: await getFileContentsAsString(poemFile.poemUri)
			},
			note: await getFileContentsAsString(poemFile.noteUri)
		};
	},
	savePoem: async function (poem: Poem) {
		// Not using timestamp is definitely a poor practice but switching to timestamp is too effortful
		// Leaving as is for now for the sake of backward compatibility
		const date = new Date(Date.now());
		// Replacing whitespaces with `%20` is necessary to ensure the same behavior between platforms
		const poemFileName = `${poem.poem.name.replace(/ /g, '%20')}_${date.getFullYear()}-${
			date.getMonth() + 1
		}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		const noteFileName = `${poemFileName}_note`;

		await Filesystem.writeFile({
			path: `poems/${poemFileName}.txt`,
			data: poem.poem.body,
			directory: Directory.Data,
			encoding: Encoding.UTF8,
			recursive: true
		});
		await Filesystem.writeFile({
			path: `poems/${noteFileName}.txt`,
			data: poem.note,
			directory: Directory.Data,
			encoding: Encoding.UTF8,
			recursive: true
		});
	},
	updatePoem: async function (poem: Poem, poemUri: string, noteUri: string) {
		const directory = poemUri.split('poems/')[0];
		const date = poemUri.split('poems/')[1].split('_')[1];
		const time = poemUri.split('poems/')[1].split('_')[2].split('.txt')[0];
		// Replacing whitespaces with `%20` is necessary to ensure the same behavior between platforms
		const newPoemPath = `${directory}poems/${poem.poem.name.replace(/ /g, '%20')}_${date}_${time}`;
		const newPoemUri = `${newPoemPath}.txt`;
		const newNoteUri = `${newPoemPath}_note.txt`;
		// First update the file contents
		await Filesystem.writeFile({
			path: poemUri,
			data: poem.poem.body,
			encoding: Encoding.UTF8
		});
		await Filesystem.writeFile({
			path: noteUri,
			data: poem.note,
			encoding: Encoding.UTF8
		});
		// Then rename poem and note files
		await Filesystem.rename({
			from: poemUri,
			to: newPoemUri
		});
		await Filesystem.rename({
			from: noteUri,
			to: newNoteUri
		});
		return {
			newPoemUri: newPoemUri,
			newNoteUri: newNoteUri
		};
	},
	deletePoem: async function (poemUri: string, noteUri: string) {
		await Filesystem.deleteFile({
			path: poemUri
		});
		await Filesystem.deleteFile({
			path: noteUri
		});
	}
};
