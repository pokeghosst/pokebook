<script lang="ts">
	import { Share } from '@capacitor/share';

	import {
		draftPoemBodyStore,
		draftPoemNameStore,
		draftPoemNoteStore
	} from '$lib/stores/poemDraft';
	import { storageMode } from '$lib/stores/storageMode';

	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';
	import { t } from '$lib/translations';

	import Workspace from '../components/Workspace.svelte';

	const poemProps = { name: draftPoemNameStore, body: draftPoemBodyStore };
	const noteProps = draftPoemNoteStore;

	const actions = [
		{ action: stashPoem, label: $t('workspace.newPoem') as string },
		{ action: exportPoem, label: $t('workspace.exportPoem') as string },
		{ action: forgetDraft, label: $t('workspace.forgetPoem') as string }
	];

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			switch ($storageMode) {
				case 'gdrive':
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
		try {
			await Share.share({
				title: $draftPoemNameStore,
				text: $draftPoemBodyStore,
				url: 'https://book.pokeghost.org',
				dialogTitle: 'Share your poem with the world!'
			});
		} catch (e: unknown) {
			console.log('Not implemented yet!');
		}
	}
</script>

<Workspace {poemProps} {noteProps} {actions} />
