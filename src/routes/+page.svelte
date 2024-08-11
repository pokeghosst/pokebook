<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024 Pokeghost.

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
	import { onDestroy, onMount, type ComponentType } from 'svelte';

	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';

	import {
		draftPoemBodyStore,
		draftPoemNameStore,
		draftPoemNoteStore
	} from '$lib/stores/poemDraft';
	import { storageMode } from '$lib/stores/storageMode';

	import Poem from '$lib/models/Poem';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import { sharePoem } from 'lib//actions/sharePoem';
	import Workspace from '../components/Workspace.svelte';
	import Delete from '../components/svg/Delete.svelte';
	import New from '../components/svg/New.svelte';
	import Save from '../components/svg/Save.svelte';
	import ShareIcon from '../components/svg/ShareIcon.svelte';

	const poemProps = { name: draftPoemNameStore, body: draftPoemBodyStore };
	const noteProps = draftPoemNoteStore;

	const actions: { icon: ComponentType; action: () => void; label: string }[] = [
		{ icon: New, action: newPoem, label: $t('workspace.newPoem') as string },
		{ icon: Save, action: stashPoem, label: $t('workspace.savePoem') as string },
		{
			icon: ShareIcon,
			action: () =>
				sharePoem($draftPoemNameStore, $draftPoemBodyStore, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem') as string
		},
		{ icon: Delete, action: forgetDraft, label: $t('workspace.forgetPoem') as string }
	];

	onMount(async () => {
		hotkeys.filter = function () {
			return true;
		};
		hotkeys('ctrl+shift+n, command+shift+n', function () {
			stashPoem();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+shift+n, command+shift+n');
	});

	async function newPoem() {
		if (confirm($t('workspace.isSavePoem'))) {
			stashPoem();
		} else {
			clearDraftPoem();
		}
	}

	async function stashPoem() {
		if ($draftPoemNameStore !== '' && $draftPoemBodyStore !== '') {
			try {
				await toast.promise(
					Poem.save(
						{ name: $draftPoemNameStore, text: $draftPoemBodyStore, note: $draftPoemNoteStore },
						$storageMode
					),
					{
						loading: `${$t('toasts.savingPoem')}`,
						success: `${$t('toasts.poemSaved')}`,
						error: `${$t('errors.poemSaveError')}`
					},
					{
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					}
				);
				clearDraftPoem();
			} catch (e) {
				console.log(e);
				if (e instanceof Error)
					toast.error($t(e.message), {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					});
			}
		} else {
			toast(`☝️🤓 ${$t('toasts.cannotSaveEmptyPoem')}`, {
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});
		}
	}

	function forgetDraft() {
		if (confirm($t('toasts.forgetConfirm'))) {
			clearDraftPoem();
		}
	}

	function clearDraftPoem() {
		draftPoemNameStore.set('');
		draftPoemBodyStore.set('');
		draftPoemNoteStore.set('');
	}
</script>

<Workspace {poemProps} {noteProps} {actions} />
