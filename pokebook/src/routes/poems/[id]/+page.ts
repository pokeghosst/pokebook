import { browser } from '$app/environment';

import type { PoemEntity } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (browser) {
		const { poemManager } = await import('$lib/plugins/PoemManager.svelte');
		const poem = await poemManager.load(params.id);
		return { ...poem, id: params.id };
	}
	return {} as PoemEntity & { id: string };
};
