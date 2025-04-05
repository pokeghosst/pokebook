import { browser } from '$app/environment';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (browser) {
		const poemId = params.id;

		return { poemId };
	}

	// TODO: Come up with proper name
	throw new Error('Not implemented');
};
