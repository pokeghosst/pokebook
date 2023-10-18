<script>
	import Workspace from '../components/Workspace.svelte';
	import generateImage from '../util/poem2image';
	import Overlay from '../components/Overlay.svelte';
	import { onMount } from 'svelte';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
	import { Share } from '@capacitor/share'

	let thinking = false;

	let poemProps;
	let noteProps;
	let storageMode;

	$: if (poemProps) {
		Preferences.set({
			key: 'draft_poem_text',
			value: poemProps.poem
		});
		Preferences.set({
			key: 'draft_poem_name',
			value: poemProps.poemName
		});
	}

	$: if (noteProps) {
		Preferences.set({
			key: 'draft_poem_note',
			value: noteProps.note
		});
	}

	onMount(async () => {
		const poemDraftText = await Preferences.get({ key: 'draft_poem_text' });
		const poemDraftName = await Preferences.get({ key: 'draft_poem_name' });
		const poemDraftNote = await Preferences.get({ key: 'draft_poem_note' });

		poemProps = {
			poem: poemDraftText.value || '',
			poemName: poemDraftName.value || 'Unnamed'
		};
		noteProps = {
			note: poemDraftNote.value || ''
		};

		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';
	});

	async function stashPoem() {
		const poemDraftText = await Preferences.get({ key: 'draft_poem_text' });
		const poemDraftName = await Preferences.get({ key: 'draft_poem_name' });
		const poemDraftNote = await Preferences.get({ key: 'draft_poem_note' });

		const gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });

		if (poemDraftText !== '' && poemDraftName !== '') {
			const nowDate = new Date(Date.now());
			switch (storageMode) {
				case 'gdrive':
					thinking = true;
					const options = {
						url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`,
						headers: {
							Authorization: gDriveUuidPref.value,
							'content-type': 'application/json'
						},
						data: JSON.stringify({
							poem_name: poemDraftName.value,
							poem_body: poemDraftText.value,
							poem_note: poemDraftNote.value,
							poem_timestamp: `${nowDate.getFullYear()}-${
								nowDate.getMonth() + 1
							}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
						})
					};
					const response = await CapacitorHttp.post(options);
					console.log(response);
					if (response.status === 200) {
						thinking = false;
					} else {
						alert(
							`Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: Error code ${response.status} Additional information: ${response.data}`
						);
					}
					thinking = false;
					break;
				case 'local':
					await Filesystem.writeFile({
						path: `poems/${poemDraftName.value}_${nowDate.getFullYear()}-${
							nowDate.getMonth() + 1
						}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}.txt`,
						data: poemDraftText.value,
						directory: Directory.Data,
						encoding: Encoding.UTF8,
						recursive: true
					});
					await Filesystem.writeFile({
						path: `poems/${poemDraftName.value}_${nowDate.getFullYear()}-${
							nowDate.getMonth() + 1
						}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}_note.txt`,
						data: poemDraftNote.value,
						directory: Directory.Data,
						encoding: Encoding.UTF8,
						recursive: true
					});
					break;
			}
			Preferences.set({
				key: 'draft_poem_text',
				value: ''
			});
			Preferences.set({
				key: 'draft_poem_name',
				value: 'Unnamed'
			});
			Preferences.set({
				key: 'draft_poem_note',
				value: ''
			});
			location.reload();
		} else {
			alert('You cannot save a poem without a name or... a poem!');
		}
	}

	function forgetDraft() {
		if (confirm('Heads up! You sure want to forget this poem?')) {
			Preferences.set({
				key: 'draft_poem_text',
				value: ''
			});
			Preferences.set({
				key: 'draft_poem_name',
				value: 'Unnamed'
			});
			Preferences.set({
				key: 'draft_poem_note',
				value: ''
			});
			location.reload();
		}
	}

	async function exportPoem() {
		// TODO: This is so bad but I have no time
		// thinking = true;
		// generateImage(poemProps.poemName);
		await Share.share({
			title: poemProps.poemName,
			text: poemProps.poem,
			url: 'https://book.pokeghost.org',
			dialogTitle: 'Share your poem with the world!'
		})
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
	<!-- <button
		on:click={exportPoem}
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block mr-2"
		>Export as image</button
	> -->
	<button
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block"
		on:click={forgetDraft}>Forget poem</button
	>
</div>
{#if poemProps != null && noteProps != null}
	<Workspace bind:poemProps bind:noteProps />
{/if}
