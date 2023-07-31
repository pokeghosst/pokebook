<script>
	import Workspace from '../components/Workspace.svelte';
	import generateImage from '../util/poem2image';
	import Overlay from '../components/Overlay.svelte';
	import { onMount } from 'svelte';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';

	let thinking = false;

	let poemProps;
	let noteProps;
	let storageMode;
	let refreshCode;

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
		const refreshCodePref = await Preferences.get({ key: 'refresh_code' });
		refreshCode = refreshCodePref.value || '';
	});

	async function stashPoem() {
		const poemDraftText = await Preferences.get({ key: 'draft_poem_text' });
		const poemDraftName = await Preferences.get({ key: 'draft_poem_name' });
		const poemDraftNote = await Preferences.get({ key: 'draft_poem_note' });

		if (poemDraftText !== '' && poemDraftName !== '') {
			const nowDate = new Date(Date.now());
			switch (storageMode) {
				case 'gdrive':
					thinking = true;
					const auth = JSON.parse(refreshCode);
					const response = await fetch('/api/gdrive/savepoem', {
						method: 'POST',
						body: JSON.stringify({
							refreshToken: auth.access_token,
							poemName: poemDraftName.value,
							poemBody: poemDraftText.value,
							poemNote: poemDraftNote.value,
							timestamp: `${nowDate.getFullYear()}-${
								nowDate.getMonth() + 1
							}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
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
					await Filesystem.writeFile({
						path: `poems/${poemDraftName.value}_${nowDate.getFullYear()}-${
							nowDate.getMonth() + 1
						}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}.txt`,
						data: poemDraftText.value,
						directory: Directory.Documents,
						encoding: Encoding.UTF8
					});
					await Filesystem.writeFile({
						path: `poems/${poemDraftName.value}_${nowDate.getFullYear()}-${
							nowDate.getMonth() + 1
						}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}_note.txt`,
						data: poemDraftNote.value,
						directory: Directory.Documents,
						encoding: Encoding.UTF8
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

	function exportPoem() {
		thinking = true;
		generateImage(poemProps.poemName);
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
{#if poemProps != null && noteProps != null}
	<Workspace bind:poemProps bind:noteProps />
{/if}
