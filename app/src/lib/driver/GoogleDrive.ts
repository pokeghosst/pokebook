import type { PoemEntity, StorageDriver } from '$lib/types';
import type { PoemFile } from '@pokebook/shared';

import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';

export class GoogleDrive implements StorageDriver {
	listPoems(): Promise<PoemFile[]> {
		throw new Error('Method not implemented.');
	}
	loadPoem(poemUri: string): Promise<PoemEntity> {
		throw new Error('Method not implemented.');
	}
	savePoem(poem: PoemEntity): Promise<{ id: string; timestamp: number } | void> {
		throw new Error('Method not implemented.');
	}
	updatePoem(poem: PoemEntity, poemUri: string): Promise<string | void> {
		throw new Error('Method not implemented.');
	}
	deletePoem(poemUri: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
	async retrieveEncodedManifest(): Promise<string | null> {
		const response = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			credentials: 'include'
		});

		if (response.status === 404) return null;

		return await response.json();
	}
}
