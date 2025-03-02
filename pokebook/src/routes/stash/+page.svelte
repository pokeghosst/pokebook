<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2025 Pokeghost.

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
-->

<script lang="ts">
	import { goto } from '$app/navigation';

	import { poemManager } from '$lib/service/PoemManager.svelte.js';

	import { t } from '$lib/translations';

	// TODO: With the addition of .tmp files, these stores (aside from uri?) don't have to be in the Preferences. Revise
	import { currentPoemUri } from '$lib/stores/currentPoem';

	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';

	let cachedPoems = poemManager.getCacheManager().getPoems();

	import PoemCacheManager from '$lib/plugins/PoemCacheManager.svelte';

	async function goToPoem(poemUri: string) {
		$currentPoemUri = poemUri;
		await goto('/stash/poem');
	}

	async function handleCacheRefresh() {
		// cachedPoems = PoemCacheManager.refreshCache($storageMode);
		throw Error('Not implemented');
	}
</script>

{#if cachedPoems && cachedPoems.length > 0}
	<div class="refresh-wrapper">
		<button class="button" on:click={handleCacheRefresh}>Refresh <RotateCcw /></button>
	</div>
	<div class="poem-list">
		{#each cachedPoems as record}
			<div class="list-item">
				<button on:click={() => goToPoem(record.id)}>
					<div class="list-poem">
						<p class="list-poem-name">
							{record.name}{record.unsavedChanges ? ` (${$t('workspace.unsaved')})` : ''}
						</p>
						<p class="list-poem-snippet">{record.poemSnippet}...</p>
					</div>
					<div>{new Intl.DateTimeFormat('en-US').format(new Date(record.timestamp))}</div>
				</button>
			</div>
		{/each}
	</div>
{:else}
	<div class="placeholder-text-wrapper">
		{$t('workspace.emptyPoemList')}
	</div>
{/if}
