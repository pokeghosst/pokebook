import type { PoemEntity } from '../types';
import type { IPoemStorageDriver } from './IPoemStorageDriver';

export const FilesystemStorageDriver: IPoemStorageDriver = {
	listPoems: async function () {
		throw new Error('Method not implemented.');
	},
	loadPoem: async function (poemUri: string) {
		throw new Error('Method not implemented.');
	},
	savePoem: async function (poem: PoemEntity) {
		// if (window.__TAURI__) {
		// 	const tokenExists = await exists('PokeBook', {
		// 		baseDir: BaseDirectory.Home
		// 	});
		// 	if (!tokenExists)
		// 		await mkdir('PokeBook', {
		// 			baseDir: BaseDirectory.Home
		// 		});
		// 	await writeTextFile('PokeBook/poem.xml', new XMLBuilder({ format: true }).build(poem), {
		// 		baseDir: BaseDirectory.Home
		// 	});
		// }
	},
	updatePoem: async function (poem: PoemEntity, poemUri: string) {
		throw new Error('Method not implemented.');
	},
	deletePoem: async function (poemUri: string) {
		throw new Error('Method not implemented.');
	}
};
