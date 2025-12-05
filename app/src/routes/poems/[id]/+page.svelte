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
	import { onMount } from 'svelte';

	import { deletePoem, getPoem } from '$lib/services/poems.service';
	import { t } from '$lib/translations';

	import Workspace from '@/components/Workspace.svelte';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import type { ToolbarItem } from '$lib/types';
	import type { PageProps } from './$types';
	import { PoemDoc } from '@pokebook/shared';

	let { data }: PageProps = $props();

	const FALLBACK_DELAY_MS = 150;

	let poemId: string = data.poemId;

	let poemPromise = getPoem(poemId);
	let showFallback = $state(false);
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	let resolvedPoem = $state(await getPoem(poemId))
	let poemDoc = $derived(PoemDoc.fromEncodedState(resolvedPoem.doc))

	let poem: { name: string; text: string } | null = $derived({ name: poemDoc.name.toString(), text: poemDoc.text.toString() });
	let note: { note: string } | null = $derived({note: poemDoc.note.toString()});

	onMount(() => {

		// TODO: Wrap template in <svelte:boundary> but still use fallback timeout
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY_MS);

		return () => clearTimeout(fallbackTimeout);
	});

	function updatePoemName(e: InputEvent) {
		console.log(e);

		const { inputType } = e;
		console.log(inputType);
		console.log((e.currentTarget as HTMLInputElement).selectionStart);
		console.log((e.currentTarget as HTMLInputElement).selectionEnd);

		switch (inputType) {
			case 'insertText':
		}
	}

	function updatePoemText(e: InputEvent) {}

	function updateNote(e: InputEvent) {}

	// TODO: Proper debouncing for all update handlers + preventing tab closing until all changes are written

	const deleteAction = async () => {
		if (confirm(`${$t('toasts.forgetConfirm')}`)) {
			deletePoem(poemId);
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
		{ icon: Trash2, action: deleteAction, label: $t('workspace.forgetPoem') }
	];
</script>

{#await poemPromise}
	<!-- Show fallback -->
{:then}
	{#if poem && note}
		<Workspace {poem} {note} {updatePoemName} {updatePoemText} {updateNote} {toolbarActions} />
	{:else}
		<!-- Handle -->
	{/if}
{/await}
