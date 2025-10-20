/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';

import appState from '$lib/AppState.svelte';
import { makeProxy } from '$lib/util';

import type { AppRouter } from '@pokebook/backend/src/trpc/routers';
import type { CloudStoragePlugin } from './CloudStoragePlugin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pluginPromise: any;
let trpcClient: ReturnType<typeof createTRPCClient<AppRouter>> | null = null;
let wsClientInstance: ReturnType<typeof createWSClient> | null = null;

function getTRPCClient() {
	if (!trpcClient) {
		wsClientInstance = createWSClient({
			url: `ws://localhost:3000/ws`,
			retryDelayMs: () => {
				// TODO: Add exponential backoff
				return 5000;
			},
			onError: (error) => {
				console.error('[WS] Error event:', error);
			},
			onClose: (cause) => {
				if (cause?.code === 4401) {
					console.warn('[WS] Authentication failed. Please log in again.');
					wsClientInstance?.close();
				}
			}
		});

		trpcClient = createTRPCClient<AppRouter>({
			links: [wsLink({ client: wsClientInstance })]
		});
	}
	return trpcClient;
}

async function getImplementation() {
	if (!pluginPromise) {
		switch (appState.value.syncProvider) {
			case 'google':
				const trpc = getTRPCClient();
				pluginPromise = import('./CloudStorageGoogle').then((m) => new m.CloudStorageGoogle(trpc));
				break;
			default:
				pluginPromise = undefined;
		}
	}

	return pluginPromise;
}

export const CloudStorage = makeProxy<CloudStoragePlugin>(getImplementation);
