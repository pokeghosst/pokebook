<script>
	import Workspace from '../components/Workspace.svelte';
	import Overlay from '../components/Overlay.svelte';
	import { onMount, getContext } from 'svelte';
	import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
	import { Share } from '@capacitor/share';
	import { t } from '$lib/translations';
	import { localSavePoem } from '$lib/localstorage-driver';
	import {
		draftPoemNameStore,
		draftPoemBodyStore,
		draftPoemNoteStore
	} from '../stores/draft-store';

	let thinking = false;

	let poemProps;
	let noteProps;
	let storageMode;

	let translationPromise = getContext('translationPromise');

	let actions = [];

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
			// { action: exportPoem, label: $t('workspace.exportPoem') },
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
					if (response.status === 200) {
						thinking = false;
					} else {
						alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
					}
					thinking = false;
					break;
				case 'local':
					localSavePoem({
						poem: {
							name: '',
							body: ''
						},
						note: ''
					});
					break;
			}

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

	async function exportPoem() {
		// TODO: This is so bad but I have no time
		// thinking = true;
		// generateImage(poemProps.poemName);
		await Share.share({
			title: poemProps.poemName,
			text: poemProps.poem,
			url: 'https://book.pokeghost.org',
			dialogTitle: 'Share your poem with the world!'
		});
	}
</script>

{#if thinking}
	<Overlay />
{/if}

<Workspace {actions} />
