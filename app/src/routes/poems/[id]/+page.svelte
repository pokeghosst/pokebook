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
	import { goto } from '$app/navigation';
	import { setContext } from 'svelte';

	import { deletePoem, putPartialUpdate, updatePoem } from '$lib/services/poems.service';
	import { t } from '$lib/translations';

	import Workspace from '@/components/Workspace.svelte';
	import ClipboardX from 'lucide-svelte/icons/clipboard-x';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import type { ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const poemId: string = data.poemId;
	const poemData: Poem = data.poem;
	const tmpPoemData: Poem | undefined = data.tmpPoem;

	let poem = $state({
		name: tmpPoemData?.name || poemData.name,
		text: tmpPoemData?.text || poemData.text
	});
	let note = $state({ note: tmpPoemData?.note || poemData.note });

	// TODO: Proper debouncing for all update handlers + preventing tab closing until all changes are written
	function updateTmpPoemName(value: string) {
		poem.name = value;
		putPartialUpdate(`${poemId}.tmp`, { name: value });
	}

	function updateTmpPoemText(value: string) {
		poem.text = value;
		putPartialUpdate(`${poemId}.tmp`, { text: value });
	}

	function updateTmpPoemNote(value: string) {
		note.note = value;
		putPartialUpdate(`${poemId}.tmp`, { note: value });
	}

	setContext('poemNameHandler', updateTmpPoemName);
	setContext('poemTextHandler', updateTmpPoemText);
	setContext('poemNoteHandler', updateTmpPoemNote);
	setContext('unsavedChanges', !!tmpPoemData);

	function saveAction() {
		updatePoem(poemId, { ...poem, ...note });
		deletePoem(`${poemId}.tmp`);
	}

	function discardTmpAction() {
		deletePoem(`${poemId}.tmp`);
		poem = { name: poemData.name, text: poemData.text };
		note = { note: poemData.note };
	}

	const deleteAction = async () => {
		if (confirm(`${$t('toasts.forgetConfirm')}`)) {
			deletePoem(poemId);
			deletePoem(`${poemId}.tmp`);
			goto('/poems');
		}
	};

	let toolbarActions: ToolbarItem[] = [
		{
			icon: Share2,
			action: () => {
				alert('Not implemented');
			},
			// sharePoem
			label: $t('workspace.sharePoem')
		},
		{ icon: Save, action: saveAction, label: $t('workspace.savePoem') },
		tmpPoemData
			? { icon: ClipboardX, action: discardTmpAction, label: $t('workspace.discardChanges') }
			: { icon: Trash2, action: deleteAction, label: $t('workspace.forgetPoem') }
	];
</script>

<Workspace bind:poem bind:note {toolbarActions} />
