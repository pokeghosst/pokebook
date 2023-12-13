<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

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
	import { PoemGoogleDriveStorageDriver } from '$lib/PoemGoogleDriveStorageDriver';

	const poemProps = { name: draftPoemNameStore, body: draftPoemBodyStore };
	const noteProps = draftPoemNoteStore;

	const actions = [
		{ action: stashPoem, label: $t('workspace.newPoem') as string },
		{ action: exportPoem, label: $t('workspace.exportPoem') as string },
		{ action: forgetDraft, label: $t('workspace.forgetPoem') as string }
	];

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			const poem = {
				poem: {
					name: $draftPoemNameStore,
					body: $draftPoemBodyStore
				},
				note: $draftPoemNoteStore
			};
			switch ($storageMode) {
				case 'gdrive':
					PoemGoogleDriveStorageDriver.savePoem(poem);
					break;
				case 'local':
					PoemLocalStorageDriver.savePoem(poem);
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
