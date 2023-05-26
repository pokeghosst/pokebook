<script>
	import Workspace from '../components/Workspace.svelte';
	import { poemStorage, poemNameStorage, noteStorage } from '../stores/poemStore.js';
	import { db } from '../stores/db.js';
	import generateImage from '../util/poem2image';
	import { storageMode } from '../stores/storage';
	import { refreshCode } from '../stores/refreshCode';
	import Overlay from '../components/Overlay.svelte';
	import { useMediaQuery } from 'svelte-breakpoints';

	let thinking = false;

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

	const isMobile = useMediaQuery('(max-width: 488px)');

	async function stashPoem() {
		if ($poemStorage !== '' && $poemNameStorage !== '') {
			switch ($storageMode) {
				case 'gdrive':
					thinking = true;
					const auth = JSON.parse($refreshCode);
					const response = await fetch('/api/gdrive/savepoem', {
						method: 'POST',
						body: JSON.stringify({
							refreshToken: auth.refresh_token,
							poemName: $poemNameStorage,
							poemBody: $poemStorage,
							poemNote: $noteStorage,
							timestamp: Date.now()
						}),
						headers: {
							'content-type': 'application/json'
						}
					});
					const responseJson = await response.json();
					if (response.status === 200) {
						if (responseJson.code === 500) {
							alert(
								"Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: \"" +
									responseJson.message +
									'"'
							);
						} else {
							noteStorage.update(() => '');
							poemStorage.update(() => '');
							poemNameStorage.update(() => 'Unnamed');
							location.reload();
						}
					} else {
						alert(
							"Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: \"" +
								response.status +
								' ' +
								response.statusText +
								'"'
						);
					}
					thinking = false;
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

	function exportPoem() {
		thinking = true;
		generateImage($poemNameStorage)
	}
</script>

{#if thinking}
	<Overlay />
{/if}

<div class="toolbelt w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto">
	<button
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block mr-2"
		on:click={stashPoem}>New poem (&save this one)</button
	>
	<button
		on:click={exportPoem}
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block mr-2"
		>Export as image</button
	>
	<button
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block"
		on:click={forgetDraft}>Forget poem</button
	>
</div>
<Workspace bind:poemProps bind:noteProps />
