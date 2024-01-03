<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
	import { PoemGoogleDriveStorageDriver } from '$lib/driver/PoemGoogleDriveStorageDriver';
	import {
		currentPoemName,
		currentPoemUnsavedChanges,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';

	import type { PoemFile } from '$lib/types/PoemFile';
	import { PoemDropboxStorageDriver } from '$lib/driver/PoemDropboxStorageDriver';
	import { t } from '$lib/translations';

	const FALLBACK_DELAY = 100; // ms

	let poemFilesPromise: Promise<PoemFile[]>;
	let showFallback = false;
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	onMount(async () => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY);

		switch ($storageMode) {
			case 'dropbox':
				poemFilesPromise = PoemDropboxStorageDriver.listPoems();
				break;
			case 'gdrive':
				poemFilesPromise = PoemGoogleDriveStorageDriver.listPoems();
				break;
			case 'local':
				poemFilesPromise = PoemLocalStorageDriver.listPoems();
				break;
		}
		return () => clearTimeout(fallbackTimeout);
	});

	async function checkUnsavedChangesConflict(poemUri: string) {
		if ($currentPoemUnsavedChanges === 'true') {
			if ($currentPoemUri === poemUri) {
				await goto('/stash/poem');
			} else {
				alert(`You have unsaved changes in '${$currentPoemName}'`);
			}
		} else {
			$currentPoemUri = poemUri;
			await goto('/stash/poem');
		}
	}
</script>

{#await poemFilesPromise}
	{#if showFallback}
		<div class="placeholder-text-wrapper">
			<p>Loading...</p>
		</div>
	{/if}
{:then poemFiles}
	{#if poemFiles && poemFiles.length > 0}
		<div class="poem-list">
			{#each poemFiles as poemFile}
				<div class="list-item">
					<button on:click={() => checkUnsavedChangesConflict(poemFile.poemUri)}>
						<span>{poemFile.name}</span>
						<span>{new Intl.DateTimeFormat('en-US').format(new Date(poemFile.timestamp))}</span>
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="placeholder-text-wrapper">
			Your stage is ready and the spotlight's on, but the verses are yet to bloom.
		</div>
	{/if}
{:catch error}
	<div class="placeholder-text-wrapper">
		{$t(error.message)}
	</div>
{/await}
