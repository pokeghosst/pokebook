<script lang="ts">
	import { Share } from '@capacitor/share';
	import Workspace from '../components/Workspace.svelte';
	import Overlay from '../components/Overlay.svelte';
	import { draftPoemNameStore, draftPoemBodyStore, draftPoemNoteStore } from '../stores/poemDraft';
	import { storageMode } from '../stores/storageMode';
	import { intercloudGDriveSavePoem } from '$lib/intercloud-gdrive';
	import { t } from '$lib/translations';
	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';

	let thinking = false;

	const poemProps = { name: draftPoemNameStore, body: draftPoemBodyStore };
	const noteProps = draftPoemNoteStore;

	const actions = [
		{ action: stashPoem, label: $t('workspace.newPoem') },
		// { action: exportPoem, label: $t('workspace.exportPoem') },
		{ action: forgetDraft, label: $t('workspace.forgetPoem') }
	];

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			switch ($storageMode) {
				case 'gdrive':
					thinking = true;
					intercloudGDriveSavePoem({
						poem: {
							name: $draftPoemNameStore,
							body: $draftPoemBodyStore
						},
						note: $draftPoemNoteStore
					});
					thinking = false;
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
		await Share.share({
			title: $draftPoemNameStore,
			text: $draftPoemBodyStore,
			url: 'https://book.pokeghost.org',
			dialogTitle: 'Share your poem with the world!'
		});
	}
</script>

{#if thinking}
	<Overlay />
{/if}

<Workspace {poemProps} {noteProps} {actions} />
