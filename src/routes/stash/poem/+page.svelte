<script>
	import { onMount } from 'svelte';
	import { db } from '../../../stores/db';
	import { currentPoem } from '../../../stores/poemId';
	import { goto } from '$app/navigation';
	import Workspace from '../../../components/Workspace.svelte';
	import generateImage from '../../../util/poem2image';
	import { storageMode } from '../../../stores/storage';
	import { refreshCode } from '../../../stores/refreshCode';
	import Overlay from '../../../components/Overlay.svelte';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';
	import { preventTabClose } from '../../../util/preventTabClose';

	let response;
	let editMode;

	let poemProps;
	let noteProps;
	let timestamp;

	let noteId;

	let loaded = false;
	let thinking = false;

	onMount(async () => {
		switch ($storageMode) {
			case 'gdrive':
				await loadPoemFromDrive();
				break;
			case 'local':
				await loadLocal();
				break;
		}
		editMode = false;
		loaded = true;
	});

	function toggleEdit() {
		editMode = !editMode;
	}

	async function loadPoemFromDrive() {
		const auth = JSON.parse($refreshCode);
		const response = await fetch('/api/gdrive/poem', {
			method: 'POST',
			body: JSON.stringify({
				refreshToken: auth.refresh_token,
				poemId: $currentPoem
			}),
			headers: {
				'content-type': 'application/json'
			}
		});
		const responseJson = await response.json();
		timestamp = responseJson.poemName.split('_')[1];
		poemProps = {
			poem: responseJson.poemContents,
			poemName: responseJson.poemName.split('_')[0]
		};
		noteProps = {
			note: responseJson.poemNote.note
		};
		noteId = responseJson.poemNote.noteId;
	}

	async function loadLocal() {
		response = await db.poems.get({ id: Number($currentPoem) });
		poemProps = {
			poem: response.poem,
			poemName: response.name
		};

		noteProps = {
			note: response.note
		};
	}

	async function save() {
		switch ($storageMode) {
			case 'gdrive':
				thinking = true;
				const auth = JSON.parse($refreshCode);
				const response = await fetch('/api/gdrive/updatepoem', {
					method: 'POST',
					body: JSON.stringify({
						refreshToken: auth.refresh_token,
						poemId: $currentPoem,
						poemName: poemProps.poemName + '_' + timestamp,
						poemBody: poemProps.poem,
						noteId: noteId,
						note: noteProps.note
					}),
					headers: {
						'content-type': 'application/json'
					}
				});
				thinking = false;
				break;
			case 'local':
				await db.poems.where('id').equals(Number($currentPoem)).modify({
					note: noteProps.note,
					poem: poemProps.poem,
					name: poemProps.poemName
				});
				break;
		}
		toggleEdit();
	}

	async function deletePoem() {
		if (confirm('Heads up! You sure want to delete this poem?')) {
			switch ($storageMode) {
				case 'gdrive':
					thinking = true;
					const auth = JSON.parse($refreshCode);
					const response = await fetch('/api/gdrive/delete', {
						method: 'POST',
						body: JSON.stringify({
							refreshToken: auth.refresh_token,
							poemId: $currentPoem,
							noteId: noteId
						}),
						headers: {
							'content-type': 'application/json'
						}
					});
					const responseJson = await response.json();
					if (responseJson.code === 500) {
						alert(
							"Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: \"" +
								responseJson.message +
								'"'
						);
					}
					goto('/stash', { replaceState: false });
					break;
				case 'local':
					db.poems.where('id').equals(Number($currentPoem)).delete();
					goto('/stash', { replaceState: false });
					break;
			}
		}
	}
</script>

{#if thinking}
	<Overlay />
{/if}

<div class="toolbelt w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto" use:preventTabClose={editMode}>
	<button
		on:click={() => generateImage(poemProps.poemName)}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
		>Export as image</button
	>
	{#if !editMode}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
			on:click={toggleEdit}>Edit</button
		>
	{:else}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block mr-2"
			on:click={save}>Save</button
		>
	{/if}

	<button
		on:click={() => deletePoem()}
		class="mb-1 cursor-pointer underline decoration-dotted hover:no-underline inline-block"
		>Forget poem</button
	>
</div>
{#if loaded}
	<Workspace bind:poemProps bind:noteProps editable={editMode} />
{:else}
	<div class="pt-10 flex items-center justify-center">
		<Skeleton>
			<rect width="100%" height="20" x="0" y="0" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="45" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="85" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="125" rx="5" ry="5" />
		</Skeleton>
	</div>
{/if}
