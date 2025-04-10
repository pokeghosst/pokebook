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

	import { deletePoem, putPartialUpdate } from '$lib/service/poems.service';
	import { t } from '$lib/translations';

	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '@/components/Workspace.svelte';

	import type { ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const poemId: string = data.poemId;
	const poemData: Poem = data.poem;

	let poem = $state({ name: poemData.name, text: poemData.text });
	let note = $state({ note: poemData.note });

	// TODO: Proper debouncing for all update handlers + preventing tab closing until all changes are written
	function updatePoemName(value: string) {
		console.log('changing poem name');
		poem.name = value;
		putPartialUpdate(poemId, { name: value });
	}

	function updatePoemText(value: string) {
		console.log('changing poem text');
		poem.text = value;
		putPartialUpdate(poemId, { text: value });
	}

	function updatePoemNote(value: string) {
		console.log('changing poem note');
		note.note = value;
		putPartialUpdate(poemId, { note: value });
	}

	setContext('poemNameHandler', updatePoemName);
	setContext('poemTextHandler', updatePoemText);
	setContext('poemNoteHandler', updatePoemNote);

	async function deleteAction() {
		// TODO: Use proper toast
		if (confirm('Are you sure you want to delete the poem?')) {
			await deletePoem(poemId);
			await goto('/stash', { invalidateAll: true });
		}
	}

	let toolbarActions: ToolbarItem[] = [
		{
			icon: Share2,
			action: () => {
				alert('Not implemented');
			},
			// sharePoem($currentPoemName, $currentPoemBody, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		},
		{ icon: Trash2, action: deleteAction, label: $t('workspace.forgetPoem') }
	];
</script>

<Workspace bind:poem bind:note {toolbarActions} />
