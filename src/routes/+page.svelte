<script>
	import Workspace from '../components/Workspace.svelte';
	import { poemStorage, poemNameStorage, noteStorage } from '../stores/poemStore.js';
	import { db } from '../stores/db.js';
	import generateImage from '../util/poem2image';
	import { storageMode } from '../stores/storage';
	import { refreshCode } from '../stores/refreshCode';

	let poemProps = {
		poem: $poemStorage,
		poemName: $poemNameStorage
	};

	let noteProps = {
		note: $noteStorage
	};

	$: $poemStorage = poemProps.poem;
	$: $poemNameStorage = poemProps.poemName;
	$: $noteStorage = noteProps.note;

	async function stashPoem() {
		if ($poemStorage !== '' && $poemNameStorage !== '') {
			switch ($storageMode) {
				case 'gdrive':
					const auth = JSON.parse($refreshCode);
					const response = await fetch('/api/gdrive/savepoem', {
						method: 'POST',
						body: JSON.stringify({
							refreshToken: auth.refresh_token,
							poemName: $poemNameStorage,
							poemBody: $poemStorage
						}),
						headers: {
							'content-type': 'application/json'
						}
					});
					noteStorage.update(() => '');
					poemStorage.update(() => '');
					poemNameStorage.update(() => 'Unnamed');
					location.reload();
					break;
				case 'local':
					try {
						await db.poems.add({
							note: $noteStorage,
							poem: $poemStorage,
							name: $poemNameStorage,
							timestamp: Date.now()
						});
						noteStorage.update(() => '');
						poemStorage.update(() => '');
						poemNameStorage.update(() => 'Unnamed');
					} catch (e) {
						console.log(e);
					}
					location.reload();
					break;
			}
		} else {
			alert('You cannot save a poem without a name or... a poem!');
		}
	}

	function forgetDraft() {
		if (confirm('Heads up! You sure want to forget this poem?')) {
			noteStorage.update(() => '');
			poemStorage.update(() => '');
			poemNameStorage.update(() => 'Unnamed');
			location.reload();
		}
	}
</script>

<div class="toolbelt w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto">
	<button
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
		on:click={stashPoem}>New poem (&save this one)</button
	>
	<button
		on:click={() => generateImage($poemNameStorage)}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
		>Export as image</button
	>
	<button
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
		on:click={forgetDraft}>Forget poem</button
	>
</div>
<Workspace bind:poemProps bind:noteProps />
