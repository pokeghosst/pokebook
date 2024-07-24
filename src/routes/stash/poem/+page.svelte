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
	import { goto } from '$app/navigation';

	import toast from 'svelte-french-toast';

	import {
		currentPoemBody,
		currentPoemName,
		currentPoemNote,
		currentPoemNoteUri,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';
	import { saveFunction, discardFunction } from '$lib/stores/poemFunctionsStore';

	import { preventTabClose } from '$lib/util/preventTabClose';

	import UnsavedChangesToast from '../../../components/UnsavedChangesToast.svelte';
	import Workspace from '../../../components/Workspace.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import { t } from '$lib/translations';
	import Poem from '$lib/models/Poem';
	import PoemCacheDriver from '$lib/driver/PoemCacheDriver';
	import { Encoding, Filesystem } from '@capacitor/filesystem';
	import { XMLBuilder } from 'fast-xml-parser';

	let unsavedChangesToastId: string;

	let editMode = false;
	let thinking = true;

	let poemProps = { name: currentPoemName, body: currentPoemBody };
	let noteProps = currentPoemNote;

	let editOrSaveLabel = 'Edit poem';
	let editOrSaveAction = toggleEdit;

	// TODO: Maybe using stores here is not the best choice but I don't want to wreck everything now
	$: {
		Filesystem.writeFile({
			path: `${$currentPoemUri}.tmp`,
			data: new XMLBuilder({ format: true }).build({
				name: $currentPoemName,
				text: $currentPoemBody,
				note: $currentPoemNote
			}),

			encoding: Encoding.UTF8
		});
	}

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
		await PoemCacheDriver.unsetUnsavedStatus($storageMode, $currentPoemUri);
		await Poem.delete(`${$currentPoemUri}.tmp`, 'local');
		goto('/stash', { replaceState: false });
	};

	const deletePoemAction = async () => {
		if (confirm(`${$t('toasts.forgetConfirm')}`)) {
			await toast.promise(
				deletePoem(),
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

	let actions = [
		{ action: editOrSaveAction, label: editOrSaveLabel },
		{ action: deletePoemAction, label: 'workspace.forgetPoem' }
	];

	$: {
		editMode == true
			? (editOrSaveLabel = 'workspace.savePoem')
			: (editOrSaveLabel = 'workspace.editPoem');
		editMode == true ? (editOrSaveAction = $saveFunction) : (editOrSaveAction = toggleEdit);
		actions[0].label = editOrSaveLabel;
		actions[0].action = editOrSaveAction;
	}

	onMount(async () => {
		if (
			(await PoemCacheDriver.getCacheRecord($storageMode, $currentPoemUri))?.unsavedChanges === true
		) {
			unsavedChangesToastId = toast(UnsavedChangesToast, {
				duration: Infinity,
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});
			const { name, text, note } = await Poem.load(`${$currentPoemUri}.tmp`, 'local');
			$currentPoemName = name;
			$currentPoemBody = text;
			$currentPoemNote = note;

			thinking = false;
		} else {
			try {
				const poem = await Poem.load($currentPoemUri, $storageMode);
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
		}
	});

	onDestroy(() => {
		toast.dismiss(unsavedChangesToastId);
	});

	function toggleEdit() {
		PoemCacheDriver.setUnsavedStatus($storageMode, $currentPoemUri).then(() => (editMode = true));
	}

	async function save() {
		await Poem.update(
			{ name: $currentPoemName, text: $currentPoemBody, note: $currentPoemNote },
			$currentPoemUri,
			$storageMode
		);
		await Poem.delete(`${$currentPoemUri}.tmp`, 'local');
		await PoemCacheDriver.unsetUnsavedStatus($storageMode, $currentPoemUri);
		editMode = false;
	}

	async function deletePoem() {
		await Poem.delete($currentPoemUri, $storageMode);
		await Poem.delete(`${$currentPoemUri}.tmp`, 'local');
		await PoemCacheDriver.popCacheRecord($storageMode, $currentPoemUri);
		clearCurrentPoemStorage();
		await goto('/stash', { invalidateAll: true });
	}

	function clearCurrentPoemStorage() {
		$currentPoemBody =
			$currentPoemName =
			$currentPoemNote =
			$currentPoemUri =
			$currentPoemNoteUri =
				'';
	}
</script>

<div use:preventTabClose={editMode} />
{#if thinking}
	<div class="placeholder-text-wrapper">
		<p>Loading...</p>
	</div>
{:else}
	<Workspace {poemProps} {noteProps} editable={editMode} {actions} />
{/if}
