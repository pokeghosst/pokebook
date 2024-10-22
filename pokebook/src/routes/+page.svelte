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

	import { sharePoem } from '$lib/actions/sharePoem';
	import Poem from '$lib/models/Poem';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import { usePreferences, type PreferencesStore } from '$lib/hooks/usePreferences.svelte';

	import FilePlus2 from 'lucide-svelte/icons/file-plus-2';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '../components/Workspace.svelte';

	import type { ToolbarItem } from '$lib/types';

	let poem: { title: PreferencesStore; text: PreferencesStore } = {
		title: usePreferences('draft_poem_name', 'Unnamed'),
		text: usePreferences('draft_poem_text', '')
	};

	let note: PreferencesStore = usePreferences('draft_poem_note', '');
	let storageMode: PreferencesStore = usePreferences('storage_mode', 'local');

	const actions: ToolbarItem[] = [
		{ icon: FilePlus2, action: newPoem, label: $t('workspace.newPoem') },
		{ icon: Save, action: stashPoem, label: $t('workspace.savePoem') },
		{
			icon: Share2,
			action: () =>
				sharePoem(poem.title.value, poem.text.value, $t('toasts.poemCopiedToClipboard')),
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
		if (poem.title.value !== '' && poem.text.value !== '') {
			try {
				await toast.promise(
					Poem.save(
						{ name: poem.title.value, text: poem.text.value, note: note.value },
						storageMode.value
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
		poem.title.remove();
		poem.text.remove();
		note.remove();
	}
</script>

<Workspace {poem} {note} {actions} />
