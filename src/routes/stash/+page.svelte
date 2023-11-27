<script lang="ts">
	import { onMount } from 'svelte';

	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';
	import {
		currentPoemBody,
		currentPoemName,
		currentPoemNote,
		currentPoemNoteUri,
		currentPoemUnsavedChanges,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';

	import type { PoemFile } from '$lib/types/PoemFile';
	import { goto } from '$app/navigation';
	import { PoemGoogleDriveStorageDriver } from '$lib/PoemGoogleDriveStorageDriver';
	import { Preferences } from '@capacitor/preferences';

	let poems: PoemFile[] = [];
	let thinking = true;

	onMount(async () => {
		switch ($storageMode) {
			case 'gdrive':
				poems = await PoemGoogleDriveStorageDriver.listPoems();
				thinking = false;
				break;
			case 'local':
				poems = await PoemLocalStorageDriver.listPoems();
				thinking = false;
				break;
		}
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
						console.log('Unsaved changes, no need to reload poem');
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
	<div class="placeholder-text-wrapper">
		<p>Loading...</p>
	</div>
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
