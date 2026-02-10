<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

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
	import { sharePoem } from '$lib/actions/sharePoem';
	import { deletePoem, getPoem, updatePoem } from '$lib/services/poem.service';
	import {
		currentPoemBody,
		currentPoemName,
		currentPoemNote,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { discardFunction, saveFunction } from '$lib/stores/poemFunctionsStore';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { onMount, setContext } from 'svelte';
	import toast from 'svelte-french-toast';
	import Workspace from '../../../components/Workspace.svelte';

	let thinking = true;

	setContext('poem', { name: currentPoemName, text: currentPoemBody });
	setContext('note', { note: currentPoemNote });

	onMount(async () => {
		try {
			const poem = await getPoem($currentPoemUri);

			if (poem) {
				$currentPoemName = poem.name;
				$currentPoemBody = poem.text;
				$currentPoemNote = poem.note;
			}
		} catch (e) {
			if (e instanceof Error) {
				toast.error($t(e.message), {
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				});
			}
		}
		thinking = false;
	});

	// TODO: Temporary solution until the new version of `svelte-french-toast` with props is published
	$saveFunction = async () => {
		await toast.promise(
			save(),
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
	};
	$discardFunction = async () => {
		await deletePoem(`${$currentPoemUri}.tmp`);
		goto('/stash', { replaceState: false });
	};

	const deletePoemAction = async () => {
		if (confirm(`${$t('toasts.forgetConfirm')}`)) {
			await toast.promise(
				deletePoemHandler(),
				{
					loading: `${$t('toasts.deletingPoem')}`,
					success: `${$t('toasts.deletedPoem')}`,
					error: `${$t('errors.poemDeleteError')}`
				},
				{
					position: GLOBAL_TOAST_POSITION,
					style: GLOBAL_TOAST_STYLE
				}
			);
		}
	};

	async function save() {
		const newPoemUri = await updatePoem($currentPoemUri, {
			name: $currentPoemName,
			text: $currentPoemBody,
			note: $currentPoemNote
		});

		if (newPoemUri) $currentPoemUri = newPoemUri;

		await deleteTmpFile($currentPoemUri);
	}

	async function deletePoemHandler() {
		await deletePoem($currentPoemUri);
		await deleteTmpFile($currentPoemUri);
		clearCurrentPoemStorage();
		await goto('/stash', { invalidateAll: true });
	}

	let actions = [
		// TODO: Bad, bad, bad, bad!!!
		{ icon: Save, action: $saveFunction, label: $t('workspace.savePoem') },
		{
			icon: Share2,
			action: () =>
				sharePoem($currentPoemName, $currentPoemBody, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		},
		{ icon: Trash2, action: deletePoemAction, label: $t('workspace.forgetPoem') }
	];

	function clearCurrentPoemStorage() {
		$currentPoemBody = $currentPoemName = $currentPoemNote = $currentPoemUri = '';
	}

	async function deleteTmpFile(fileUri: string) {
		try {
			await deletePoem(`${fileUri}.tmp`);
		} catch (_) {
			// Do nothing
		}
	}
</script>

{#if thinking}
	<div class="placeholder-text-wrapper">
		<p>Loading...</p>
	</div>
{:else}
	<Workspace {actions} />
{/if}
