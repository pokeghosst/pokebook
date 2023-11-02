<script>
	import Workspace from '../components/Workspace.svelte';
	import Overlay from '../components/Overlay.svelte';
	import { onMount } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { Share } from '@capacitor/share';
	import { t } from '$lib/translations';
	import { localSavePoem } from '$lib/localstorage-driver';
	import {
		draftPoemNameStore,
		draftPoemBodyStore,
		draftPoemNoteStore
	} from '../stores/draft-store';

	let thinking = false;
	let storageMode;

	let actions = [
		{ action: stashPoem, label: $t('workspace.newPoem') },
		// { action: exportPoem, label: $t('workspace.exportPoem') },
		{ action: forgetDraft, label: $t('workspace.forgetPoem') }
	];

	onMount(async () => {
		storageMode = (await Preferences.get({ key: 'storage_mode' })).value || 'local';
	});

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && draftPoemBodyStore !== '') {
			switch (storageMode) {
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
					localSavePoem({
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
