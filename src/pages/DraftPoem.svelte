<script lang="ts">
	import { Share } from '@capacitor/share';
	import { Capacitor } from '@capacitor/core';
	import Workspace from '../components/Workspace.svelte';
	import {
		draftPoemNameStore,
		draftPoemBodyStore,
		draftPoemNoteStore
	} from '../lib/stores/poemDraft';
	import { storageMode } from '../lib/stores/storageMode';
	import { intercloudGDriveSavePoem } from '$lib/intercloud-gdrive';
	import { t } from '$lib/translations';
	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';

	const poemProps = { name: draftPoemNameStore, body: draftPoemBodyStore };
	const noteProps = draftPoemNoteStore;

	const actions = [
		{ action: stashPoem, label: $t('workspace.newPoem') },
		{ action: exportPoem, label: $t('workspace.exportPoem') },
		{ action: forgetDraft, label: $t('workspace.forgetPoem') }
	];

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			switch ($storageMode) {
				case 'gdrive':
					intercloudGDriveSavePoem({
						poem: {
							name: $draftPoemNameStore,
							body: $draftPoemBodyStore
						},
						note: $draftPoemNoteStore
					});
					break;
				case 'local':
					PoemLocalStorageDriver.savePoem({
						poem: {
							name: $draftPoemNameStore,
							body: $draftPoemBodyStore
						},
						note: $draftPoemNoteStore
					});
					break;
			}
			clearDraftPoem();
		} else {
			alert($t('popups.cannotSaveEmptyPoem'));
		}
	}

	function forgetDraft() {
		if (confirm($t('popups.forgetConfirm'))) {
			clearDraftPoem();
		}
	}

	function clearDraftPoem() {
		draftPoemNameStore.set($t('workspace.unnamed'));
		draftPoemBodyStore.set('');
		draftPoemNoteStore.set('');
	}

	async function exportPoem() {
		if (Capacitor.isNativePlatform()) {
			await Share.share({
				title: $draftPoemNameStore,
				text: $draftPoemBodyStore,
				url: 'https://book.pokeghost.org',
				dialogTitle: 'Share your poem with the world!'
			});
		}
	}
</script>

<Workspace {poemProps} {noteProps} {actions} />
