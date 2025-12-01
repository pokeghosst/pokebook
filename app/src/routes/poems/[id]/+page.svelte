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

	const poemId: string = data.poemId;

	let poemPromise = getPoem(poemId);
	let showFallback = $state(false);
	let fallbackTimeout: ReturnType<typeof setTimeout>;

	let poem: { name: string; text: string } | null = $state(null);
	let note: { note: string } | null = $state(null);

	onMount(() => {
		fallbackTimeout = setTimeout(() => {
			showFallback = true;
		}, FALLBACK_DELAY_MS);

		(async () => {
			const resolvedPoem = await poemPromise;

			if (!resolvedPoem) {
				alert('TODO: We messed up!');
				return;
			}

			const poemDoc = PoemDoc.fromEncodedState(resolvedPoem.doc);

			poem = { name: poemDoc.name.toString(), text: poemDoc.text.toString() };
			note = { note: poemDoc.note.toString() };
		})();

		return () => clearTimeout(fallbackTimeout);
	});

	function updatePoemName(value: string) {}

	function updatePoemText(value: string) {}

	function updateNote(value: string) {}

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
		<Workspace {poem} {note} {toolbarActions} />
	{:else}
		<!-- Handle -->
	{/if}
{/await}
