<script lang="ts">
	import { onMount } from 'svelte';
	import { storageMode } from '$lib/stores/storageMode';
	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';
	import {
		currentPoemName,
		currentPoemBody,
		currentPoemNote,
		currentPoemUri,
		currentPoemNoteUri,
		currentPoemUnsavedChanges
	} from '$lib/stores/currentPoem';
	import type { PoemFile } from '$lib/types/PoemFile';
    import { navigate } from "svelte-navigator";

	let poems: PoemFile[] = [];
	let thinking = true;

	onMount(async () => {
		switch ($storageMode) {
			case 'gdrive':
				// thinking = true;
				// const response = await loadPoemsFromDrive();
				// switch (response.status) {
				// 	case 200:
				// 		poems = response.data.files;
				// 		break;
				// 	case 401:
				// 		alert($t('popups.unauthorized'));
				// 		break;
				// 	default:
				// 		alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
				// 		break;
				// }
				thinking = false;
				break;
			case 'local':
				try {
					poems = await PoemLocalStorageDriver.listPoems();
				} catch (e: unknown) {
					alert(e);
				}
				thinking = false;
				break;
		}
	});

	async function loadPoem(poemFile: PoemFile) {
		switch ($storageMode) {
			case 'gdrive':
				break;
			case 'local':
				const poem = await PoemLocalStorageDriver.loadPoem(poemFile);
				if ($currentPoemUnsavedChanges === 'true') {
					if ($currentPoemUri === poemFile.poemUri) {
						console.log('Unsaved changes, no need to reload poem');
						navigate('/stash/poem', { replace: true });
					} else {
						alert(`You have unsaved changes in '${$currentPoemName}'`);
					}
				} else {
					$currentPoemName = poem.poem.name;
					$currentPoemBody = poem.poem.body;
					$currentPoemNote = poem.note;
					$currentPoemUri = poemFile.poemUri;
					$currentPoemNoteUri = poemFile.noteUri;
					navigate('/stash/poem', { replace: true });
				}
				break;
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
					<div>{poem.name}</div>
					<div>{new Intl.DateTimeFormat('en-US').format(new Date(poem.timestamp))}</div>
				</button>
			</div>
		{/each}
	</div>
{:else}
	<div class="placeholder-text-wrapper">
		Your stage is ready and the spotlight's on, but the verses are yet to bloom.
	</div>
{/if}
