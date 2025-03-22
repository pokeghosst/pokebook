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
	import { onMount } from 'svelte';

	import { t } from '$lib/translations';

	import { poemManager, type PoemManifestRecord } from '$lib/service/PoemManager.svelte';

	// TODO: With the addition of .tmp files, these stores (aside from uri?) don't have to be in the Preferences. Revise
	import { currentPoemUri } from '$lib/stores/currentPoem';

	import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';

	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import RefreshCcw from 'lucide-svelte/icons/refresh-ccw';

	const FALLBACK_DELAY_MS = 150;

	let cachedPoems: PoemManifestRecord[];
	let showFallback = false;
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY_MS);

		cachedPoems = poemManager.getPoems();

		if (cachedPoems.length === 0) {
			rebuildManifest();
		}

		return () => clearTimeout(fallbackTimeout);
	});

	async function goToPoem(poemUri: string) {
		$currentPoemUri = poemUri;
		await goto('/stash/poem');
	}

	// TODO: Add timeout when rebuilding the manifest
	function rebuildManifest() {
		poemManager.rebuildManifest().then(() => {
			cachedPoems = poemManager.getPoems();
		});
	}

	async function syncToCloud() {
		const t1 = Date.now();
		console.log(t1)
		const manifestResult = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			credentials: 'include'
		});

		if (manifestResult.status === 404) {
			// console.log('manifest missing, gotta upload one')
			// const encodedManifest = await poemManager.retrieveEncodedManifestContents();
			
			// await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			// 	credentials: 'include',
			// 	method: 'PUT',
			// 	body: encodedManifest
			// });
			const result = await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/poems`, {
				credentials: 'include',
				method: 'GET'
			});
			const remotePoems = await result.json();
			console.log('remotePoems', remotePoems);
			console.log('cachedPoems', cachedPoems)

			const poemsToUpload = cachedPoems.filter((poem) => {
				return !remotePoems.find((remotePoem) => remotePoem.name === poem.filesystemPath.split('poems/')[1]);
			})

			console.log('poemsToUpload', poemsToUpload)

			const poemContentPromises = poemsToUpload.map(async poem => {
				const contents = (await poemManager.readFile(poem.filesystemPath)).data

				return {
					name: poem.filesystemPath.split('poems/')[1],
					contents
				}
			});

			const poemContentsToUpload = await Promise.all(poemContentPromises);

			console.log(poemContentsToUpload)

			await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/upload`, {
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify(poemContentsToUpload)
			})

			// await fetch(`${PUBLIC_POKEBOOK_SERVER_URL}/google/manifest`, {
			// 	credentials: 'include',
			// 	method: 'PUT',
			// 	body: await poemManager.retrieveEncodedManifestContents()
			// })

			const t2 = Date.now()
			console.log(t2)

			console.log(t2-t1)
		} else {
			const json = await manifestResult.json();
			console.log(json);
		}
	}
</script>

{#await cachedPoems}
	{#if showFallback}
		<div class="placeholder-text-wrapper">
			<p>Loading...</p>
		</div>
	{/if}
{:then cacheRecords}
	{#if cacheRecords && cacheRecords.length > 0}
		<div class="refresh-wrapper">
			<button class="button" on:click={syncToCloud}>Sync <RefreshCcw /></button>
			<button class="button" on:click={rebuildManifest}>Refresh <RotateCcw /></button>
		</div>
		<div class="poem-list">
			{#each cacheRecords.sort((a, b) => (b.updatedAt as number) - (a.updatedAt as number)) as record}
				<div class="list-item">
					<button on:click={() => goToPoem(record.filesystemPath)}>
						<div class="list-poem">
							<p class="list-poem-name">
								{record.name}{record.unsavedChanges ? ` (${$t('workspace.unsaved')})` : ''}
							</p>
							<p class="list-poem-snippet">{record.snippet}</p>
						</div>
						<div>{new Date(record.updatedAt).toLocaleDateString()}</div>
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="placeholder-text-wrapper">
			{$t('workspace.emptyPoemList')}
		</div>
	{/if}
{:catch error}
	<div class="placeholder-text-wrapper">
		{$t(error.message)}
	</div>
{/await}
