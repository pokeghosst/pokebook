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
	import { onDestroy, onMount } from 'svelte';

	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';

	import {
		draftPoemBodyStore,
		draftPoemNameStore,
		draftPoemNoteStore
	} from '$lib/stores/poemDraft';
	import { storageMode } from '$lib/stores/storageMode';

	import { sharePoem } from '$lib/actions/sharePoem';
	import Poem from '$lib/models/Poem';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import FilePlus2 from 'lucide-svelte/icons/file-plus-2';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '../components/Workspace.svelte';

	import type { ToolbarItem } from '$lib/types';
	import { Preferences } from 'lib/plugins/Preferences';
	import { draftPoemNote, draftPoemText, draftPoemTitle } from 'lib/stored/draft.svelte';
	import { usePreferences } from 'lib/hooks/usePreferences.svelte';

	let poem: { title: { value: string }; text: { value: string } } = {
		title: usePreferences('draft_poem_name', 'Unnamed'),
		text: usePreferences('draft_poem_text', '')
	};

	let note: { value: string } = usePreferences('draft_poem_note', '');

	// $effect(() => {
	// 	Preferences.set({ key: 'draft_poem_name', value: poemProps.title.replace(/[./_]/g, '') });
	// });

	// $effect(() => {
	// 	if (poemProps.text !== null) Preferences.set({ key: 'draft_poem_text', value: poemProps.text });
	// });

	// $effect(() => {
	// 	Preferences.set({ key: 'draft_poem_note', value: poemNote });
	// });

	const actions: ToolbarItem[] = [
		{ icon: FilePlus2, action: newPoem, label: $t('workspace.newPoem') },
		{ icon: Save, action: stashPoem, label: $t('workspace.savePoem') },
		{
			icon: Share2,
			action: () =>
				sharePoem($draftPoemNameStore, $draftPoemBodyStore, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		},
		{ icon: Trash2, action: forgetDraft, label: $t('workspace.forgetPoem') }
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

<Workspace {poem} {note} {actions} />
