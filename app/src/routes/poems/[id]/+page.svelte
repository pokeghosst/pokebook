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

	import { putPartialUpdate } from '$lib/service/poems.service';
	import { discardFunction, saveFunction } from '$lib/stores/poemFunctionsStore';
	import { t } from '$lib/translations';
	import toast from 'svelte-french-toast';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import Save from 'lucide-svelte/icons/save';
	import Share2 from 'lucide-svelte/icons/share-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	import Workspace from '@/components/Workspace.svelte';
	import UnsavedChangesToast from '@/components/UnsavedChangesToast.svelte';

	import type { PageProps, ToolbarItem } from '$lib/types';
	import type { Poem } from '@pokebook/shared';

	let { data }: PageProps = $props();

	const poemId: string = data.poemId;
	const poemData: Poem = data.poem;
	const tmpPoemData: Poem | undefined = data.tmpPoem;
	let unsavedChangesToastId: string | undefined = undefined;

	let poem = $state({
		name: tmpPoemData?.name || poemData.name,
		text: tmpPoemData?.text || poemData.text
	});
	let note = $state({ note: tmpPoemData?.note || poemData.note });

	// TODO: Proper debouncing for all update handlers + preventing tab closing until all changes are written
	function updateDraftPoemName(value: string) {
		console.log('changing poem name');
		poem.name = value;
		putPartialUpdate(`${poemId}.tmp`, { name: value });
	}

	setContext('poemNameHandler', updateDraftPoemName);

	$saveFunction = async () => {
		alert('Not implemented');
		// await toast.promise(
		// 	save(),
		// 	{
		// 		loading: `${$t('toasts.savingPoem')}`,
		// 		success: `${$t('toasts.poemSaved')}`,
		// 		error: `${$t('errors.poemSaveError')}`
		// 	},
		// 	{
		// 		position: GLOBAL_TOAST_POSITION,
		// 		style: GLOBAL_TOAST_STYLE
		// 	}
		// );
	};
	$discardFunction = async () => {
		alert('Not implemented');
		// await PoemCacheManager.unsetUnsavedStatus($storageMode, $currentPoemUri);
		// await Poem.delete(`${$currentPoemUri}.tmp`, 'local');
		// goto('/stash', { replaceState: false });
	};

	const deletePoemAction = async () => {
		// if (confirm(`${$t('toasts.forgetConfirm')}`)) {
		// 	await toast.promise(
		// 		deletePoem(),
		// 		{
		// 			loading: `${$t('toasts.deletingPoem')}`,
		// 			success: `${$t('toasts.deletedPoem')}`,
		// 			error: `${$t('errors.poemDeleteError')}`
		// 		},
		// 		{
		// 			position: GLOBAL_TOAST_POSITION,
		// 			style: GLOBAL_TOAST_STYLE
		// 		}
		// 	);
		// }
	};

	async function save() {
		alert('Not implemented');
		// const newPoemUri = await Poem.update(
		// 	{ name: $currentPoemName, text: $currentPoemBody, note: $currentPoemNote },
		// 	$currentPoemUri,
		// 	$storageMode
		// );

		// if (newPoemUri) $currentPoemUri = newPoemUri;

		// await deleteTmpFile($currentPoemUri);
	}

	async function deletePoem() {
		alert('Not implemented');
		// await Poem.delete($currentPoemUri, $storageMode);
		// await deleteTmpFile($currentPoemUri);
		// await PoemCacheManager.popCacheRecord($storageMode, $currentPoemUri);
		// clearCurrentPoemStorage();
		// await goto('/stash', { invalidateAll: true });
	}

	let toolbarActions: ToolbarItem[] = [
		{ icon: Save, action: $saveFunction, label: $t('workspace.savePoem') },
		{
			icon: Share2,
			action: () => {
				alert('Not implemented');
			},
			// sharePoem($currentPoemName, $currentPoemBody, $t('toasts.poemCopiedToClipboard')),
			label: $t('workspace.sharePoem')
		},
		{ icon: Trash2, action: deletePoemAction, label: $t('workspace.forgetPoem') }
	];

	onMount(async () => {
		// if (
		// 	(await PoemCacheManager.getCacheRecord($storageMode, $currentPoemUri))?.unsavedChanges ===
		// 	true
		// ) {
		if (tmpPoemData) {
			unsavedChangesToastId = toast(UnsavedChangesToast, {
				duration: Infinity,
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});
		}
		// 	const { name, text, note } = await Poem.load(`${$currentPoemUri}.tmp`, 'local');
		// 	$currentPoemName = name;
		// 	$currentPoemBody = text;
		// 	$currentPoemNote = note;
		// 	thinking = false;
		// } else {
		// 	try {
		// 		const poem = await Poem.load($currentPoemUri, $storageMode);
		// 		if (poem) {
		// 			$currentPoemName = poem.name;
		// 			$currentPoemBody = poem.text;
		// 			$currentPoemNote = poem.note;
		// 		}
		// 	} catch (e) {
		// 		if (e instanceof Error) {
		// 			toast.error($t(e.message), {
		// 				position: GLOBAL_TOAST_POSITION,
		// 				style: GLOBAL_TOAST_STYLE
		// 			});
		// 		}
		// 	}
		// 	thinking = false;
		// }
	});

	onDestroy(() => {
		toast.dismiss(unsavedChangesToastId);
	});

	async function deleteTmpFile(fileUri: string) {
		// try {
		// 	await Poem.delete(`${fileUri}.tmp`, 'local');
		// } catch (_) {}
	}
</script>

<Workspace bind:poem bind:note />
