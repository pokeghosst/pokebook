import { Filesystem } from '$lib/plugins/Filesystem';
import { PoemCacheManager } from '$lib/plugins/PoemCacheManager';

import type { PoemCacheRecord, PoemEntity } from '$lib/types';

const POEM_SNIPPET_LENGTH = 256;

const poemList: PoemCacheRecord[] = $state(await PoemCacheManager.list());

export function getPoemCacheList(): PoemCacheRecord[] {
	return poemList;
}

export async function pushToPoemList(poem: PoemEntity) {
	const now = Date.now();
	const id = crypto.randomUUID();

	await Filesystem.writeFile({
		path: `/${id}.json`,
		data: JSON.stringify(poem)
	});

	const poemCacheRecord: PoemCacheRecord = {
		poemId: id,
		name: poem.name,
		createdAt: now,
		modifiedAt: now,
		unsavedChanges: false,
		poemSnippet:
			poem.text.slice(0, POEM_SNIPPET_LENGTH) +
			(poem.text.length > POEM_SNIPPET_LENGTH ? '...' : '')
	};

	poemCacheRecord.cacheId = await PoemCacheManager.push(poemCacheRecord);
	poemList.push(poemCacheRecord);
}
