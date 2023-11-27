import type { PoemFile } from '$lib/types/PoemFile';

export function cachePoemListToLocalStorage(poemFilesToCache: PoemFile[]) {
	localStorage.setItem('cachedGDrivePoemList', JSON.stringify(poemFilesToCache));
}

export function retrieveCachedPoemList(): PoemFile[] {
	const poemFileList = localStorage.getItem('cachedGDrivePoemList');
	if (poemFileList != null && poemFileList !== '') {
		return JSON.parse(poemFileList);
	} else {
		return [];
	}
}
