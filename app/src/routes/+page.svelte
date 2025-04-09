<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2025 Pokeghost.

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
	import { onDestroy, onMount, setContext } from 'svelte';

	import { sharePoem } from '$lib/actions/sharePoem';
	import { deletePoem, putDraftPoem, savePoem } from '$lib/service/poems.service';
	import { t } from '$lib/translations';
	import { DRAFT_POEM_ID, GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';

	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '../components/Workspace.svelte';

	import type { ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const poemData: Poem = data;
	let poem = $state({ name: poemData.name, text: poemData.text });
	let note = $state({ note: poemData.note });

	function updatePoemName(value: string) {
		poem.name = value;
		putDraftPoem({ name: value });
	}

	function updatePoemText(value: string) {
		poem.text = value;
		putDraftPoem({ text: value });
	}

	function updatePoemNote(value: string) {
		note.note = value;
		putDraftPoem({ note: value });
	}

	setContext('poemNameHandler', updatePoemName);
	setContext('poemTextHandler', updatePoemText);
	setContext('poemNoteHandler', updatePoemNote);

	const toolbarActions: ToolbarItem[] = [
		{ icon: Save, action: stashAction, label: $t('workspace.savePoem') },
		{ icon: Trash2, action: forgetAction, label: $t('workspace.forgetPoem') },
		{ icon: Share2, action: shareAction, label: $t('workspace.sharePoem') }
	];

	onMount(async () => {
		hotkeys.filter = function () {
			return true;
		};
		hotkeys('ctrl+shift+n, command+shift+n', function () {
			stashAction();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind('ctrl+shift+n, command+shift+n');
	});

	async function stashAction() {
		if (poem.name !== '' && poem.text !== '') {
			try {
				await toast.promise(
					savePoem({ ...poem, ...note }),
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
				clearDraft();
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

	function forgetAction() {
		if (confirm($t('toasts.forgetConfirm'))) {
			clearDraft();
		}
	}

	function shareAction() {
		sharePoem(poem.name, poem.text, $t('toasts.poemCopiedToClipboard'));
	}

	async function clearDraft() {
		poem = { name: '', text: '' };
		note = { note: '' };
		await deletePoem(DRAFT_POEM_ID);
	}
</script>

<Workspace bind:poem bind:note {toolbarActions} />
