<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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

	import toast from 'svelte-french-toast';

	import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
	import { PoemGoogleDriveStorageDriver } from '$lib/driver/PoemGoogleDriveStorageDriver';
	import { t } from '$lib/translations';
	import {
		currentPoemBody,
		currentPoemName,
		currentPoemNote,
		currentPoemNoteUri,
		currentPoemUnsavedChanges,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import type { PoemFile } from '$lib/types/PoemFile';

	const FALLBACK_DELAY = 50; // ms

	let poems: PoemFile[] = [];
	let thinking = true;
	let showFallback = false;
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	onMount(async () => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY);

		switch ($storageMode) {
			case 'gdrive':
				try {
					poems = await PoemGoogleDriveStorageDriver.listPoems();
				} catch (e) {
					if (e instanceof Error)
						toast.error($t(e.message), {
							position: GLOBAL_TOAST_POSITION,
							style: GLOBAL_TOAST_STYLE
						});
				}
				thinking = false;
				break;
			case 'local':
				poems = await PoemLocalStorageDriver.listPoems();
				thinking = false;
				break;
		}
		return () => clearTimeout(fallbackTimeout);
	});

	async function loadPoem(poemFile: PoemFile) {
		switch ($storageMode) {
			case 'gdrive':
				$currentPoemName = poemFile.name;
				$currentPoemUri = poemFile.poemUri;
				$currentPoemNoteUri = poemFile.noteUri;
				await goto('/stash/poem');
				break;
			case 'local': {
				const poem = await PoemLocalStorageDriver.loadPoem(poemFile);
				if ($currentPoemUnsavedChanges === 'true') {
					if ($currentPoemUri === poemFile.poemUri) {
						await goto('/stash/poem');
					} else {
						alert(`You have unsaved changes in '${$currentPoemName}'`);
					}
				} else {
					$currentPoemName = poem.poem.name;
					$currentPoemBody = poem.poem.body;
					$currentPoemNote = poem.note;
					$currentPoemUri = poemFile.poemUri;
					$currentPoemNoteUri = poemFile.noteUri;
					await goto('/stash/poem');
				}
				break;
			}
		}
	}
</script>

{#if thinking}
	{#if showFallback}
		<div class="placeholder-text-wrapper">
			<p>Loading...</p>
		</div>
	{/if}
{:else if poems.length > 0}
	<div class="poem-list">
		{#each poems as poem}
			<div class="list-item">
				<button on:click={() => loadPoem(poem)}>
					<span>{poem.name}</span>
					<span>{new Intl.DateTimeFormat('en-US').format(new Date(poem.timestamp))}</span>
				</button>
			</div>
		{/each}
	</div>
{:else}
	<div class="placeholder-text-wrapper">
		Your stage is ready and the spotlight's on, but the verses are yet to bloom.
	</div>
{/if}
