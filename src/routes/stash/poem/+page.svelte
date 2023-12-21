<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023 Pokeghost.

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
		currentPoemUnsavedChanges,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';
	import { saveFunction, discardFunction } from '$lib/stores/poemFunctionsStore';

	import { PoemLocalStorageDriver } from '$lib/driver/PoemLocalStorageDriver';
	import { preventTabClose } from '$lib/util/preventTabClose';

	import UnsavedChangesToast from '../../../components/UnsavedChangesToast.svelte';
	import Workspace from '../../../components/Workspace.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { PoemGoogleDriveStorageDriver } from '$lib/driver/PoemGoogleDriveStorageDriver';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import { t } from '$lib/translations';

	let unsavedChangesToastId: string;

	let editMode = false;
	let thinking = true;

	let poemProps = { name: currentPoemName, body: currentPoemBody };
	let noteProps = currentPoemNote;

	let editOrSaveLabel = 'Edit poem';
	let editOrSaveAction = toggleEdit;

	// TODO: Temporary solution until the new version of `svelte-french-toast` with props is published
	$saveFunction = async () => {
		await toast.promise(
			save(),
			{
				loading: 'Saving poem...',
				success: 'Poem saved!',
				error: 'Could not save the poem'
			},
			{
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			}
		);
	};
	$discardFunction = () => {
		$currentPoemUnsavedChanges = 'false';
		goto('/stash', { replaceState: false });
	};

	const deletePoemAction = async () => {
		if (confirm('Heads up! You sure want to delete this poem?')) {
			await toast.promise(
				deletePoem(),
				{
					loading: 'Deleting poem...',
					success: 'Poem deleted!',
					error: 'Could not  the poem'
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
		{ action: deletePoemAction, label: 'Forget poem' }
	];

	$: {
		editMode == true ? (editOrSaveLabel = 'Save poem') : (editOrSaveLabel = 'Edit poem');
		editMode == true ? (editOrSaveAction = $saveFunction) : (editOrSaveAction = toggleEdit);
		actions[0].label = editOrSaveLabel;
		actions[0].action = editOrSaveAction;
	}

	onMount(async () => {
		if ($currentPoemUnsavedChanges === 'true') {
			unsavedChangesToastId = toast(UnsavedChangesToast, {
				duration: Infinity,
				position: GLOBAL_TOAST_POSITION,
				style: GLOBAL_TOAST_STYLE
			});
		} else {
			switch ($storageMode) {
				case 'gdrive': {
					try {
						const poem = await PoemGoogleDriveStorageDriver.loadPoem($currentPoemUri);
						$currentPoemName = poem.name;
						$currentPoemBody = poem.text;
						$currentPoemNote = poem.note;
					} catch (e) {
						if (e instanceof Error) {
							toast.error($t(e.message), {
								position: GLOBAL_TOAST_POSITION,
								style: GLOBAL_TOAST_STYLE
							});
						}
					}
					break;
				}
				case 'local': {
					const poem = await PoemLocalStorageDriver.loadPoem($currentPoemUri);
					$currentPoemName = poem.name;
					$currentPoemBody = poem.text;
					$currentPoemNote = poem.note;
					break;
				}
			}
		}
		thinking = false;
	});

	onDestroy(() => {
		toast.dismiss(unsavedChangesToastId);
	});

	function toggleEdit() {
		editMode = true;
		$currentPoemUnsavedChanges = 'true';
	}

	async function save() {
		switch ($storageMode) {
			case 'gdrive':
				await PoemGoogleDriveStorageDriver.updatePoem(
					{
						name: $currentPoemName,
						text: $currentPoemBody,
						note: $currentPoemNote
					},
					$currentPoemUri
				);
				break;
			case 'local': {
				const newPoemUri = await PoemLocalStorageDriver.updatePoem(
					{
						name: $currentPoemName,
						text: $currentPoemBody,
						note: $currentPoemNote
					},
					$currentPoemUri
				);
				$currentPoemUri = newPoemUri as string;
				break;
			}
		}
		editMode = false;
		$currentPoemUnsavedChanges = 'false';
	}

	async function deletePoem() {
		switch ($storageMode) {
			case 'gdrive':
				await PoemGoogleDriveStorageDriver.deletePoem($currentPoemUri);
				clearCurrentPoemStorage();
				break;
			case 'local':
				PoemLocalStorageDriver.deletePoem($currentPoemUri);
				clearCurrentPoemStorage();
				break;
		}
		await goto('/stash', { replaceState: false });
	}

	function clearCurrentPoemStorage() {
		$currentPoemBody =
			$currentPoemName =
			$currentPoemNote =
			$currentPoemUri =
			$currentPoemNoteUri =
				'';
		$currentPoemUnsavedChanges = 'false';
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
