<script>
	import Workspace from '../components/Workspace.svelte';
	import generateImage from '../util/poem2image';
	import Overlay from '../components/Overlay.svelte';
	import { onMount, getContext } from 'svelte';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
	import { t } from '$lib/translations';

	let thinking = false;

	let poemProps;
	let noteProps;
	let storageMode;

	let translationPromise = getContext('translationPromise');

	let actions = [];

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
		await translationPromise;
		const poemDraftText = await Preferences.get({ key: 'draft_poem_text' });
		const poemDraftName = await Preferences.get({ key: 'draft_poem_name' });
		const poemDraftNote = await Preferences.get({ key: 'draft_poem_note' });

		poemProps = {
			poem: poemDraftText.value || '',
			poemName: poemDraftName.value || $t('workspace.unnamed')
		};
		noteProps = {
			note: poemDraftNote.value || ''
		};

		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';

		actions = [
			{ action: stashPoem, label: $t('workspace.newPoem') },
			{ action: exportPoem, label: $t('workspace.exportPoem') },
			{ action: forgetDraft, label: $t('workspace.forgetPoem') }
		];
	});

	async function stashPoem() {
		const poemDraftText = await Preferences.get({ key: 'draft_poem_text' });
		const poemDraftName = await Preferences.get({ key: 'draft_poem_name' });
		const poemDraftNote = await Preferences.get({ key: 'draft_poem_note' });

		const gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });

		if (poemDraftText.value !== '' && poemDraftName.value !== '') {
			const nowDate = new Date(Date.now());
			switch (storageMode) {
				case 'gdrive':
					thinking = true;
					const options = {
						url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem`,
						headers: {
							Authorization: gDriveUuidPref.value
						},
						data: {
							poem_name: poemDraftName.value,
							poem_body: poemDraftText.value,
							poem_note: poemDraftNote.value,
							poem_timestamp: `${nowDate.getFullYear()}-${
								nowDate.getMonth() + 1
							}-${nowDate.getDate()}_${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}`
						}
					};
					const response = await CapacitorHttp.request({ ...options, method: 'POST' });

					if (response.status === 200) {
						thinking = false;
					} else {
						alert(
							$t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`
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
				value: $t('workspace.unnamed')
			});
			Preferences.set({
				key: 'draft_poem_note',
				value: ''
			});
			location.reload();
		} else {
			alert($t('popups.cannotSaveEmptyPoem'));
		}
	}

	function forgetDraft() {
		if (confirm($t('popups.forgetConfirm'))) {
			Preferences.set({
				key: 'draft_poem_text',
				value: ''
			});
			Preferences.set({
				key: 'draft_poem_name',
				value: $t('workspace.unnamed')
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

{#if poemProps != null && noteProps != null}
	<Workspace bind:poemProps bind:noteProps {actions} />
{/if}
