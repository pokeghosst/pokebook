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

	import {
		currentPoemBody,
		currentPoemName,
		currentPoemNote,
		currentPoemNoteUri,
		currentPoemUnsavedChanges,
		currentPoemUri
	} from '$lib/stores/currentPoem';
	import { storageMode } from '$lib/stores/storageMode';

	import { PoemLocalStorageDriver } from '$lib/PoemLocalStorageDriver';
	import { preventTabClose } from '$lib/util/preventTabClose';

	import Toast from '../../../components/Toast.svelte';
	import Workspace from '../../../components/Workspace.svelte';
	import { onMount } from 'svelte';
	import { PoemGoogleDriveStorageDriver } from '$lib/PoemGoogleDriveStorageDriver';
	import { json } from '@sveltejs/kit';

	let editMode = false;
	let thinking = true;

	let poemProps = { name: currentPoemName, body: currentPoemBody };
	let noteProps = currentPoemNote;

	let editOrSaveLabel = 'Edit poem';
	let editOrSaveAction = toggleEdit;

	let actions = [
		{ action: editOrSaveAction, label: editOrSaveLabel },
		{ action: deletePoem, label: 'Forget poem' }
	];

	$: {
		editMode == true ? (editOrSaveLabel = 'Save poem') : (editOrSaveLabel = 'Edit poem');
		editMode == true ? (editOrSaveAction = save) : (editOrSaveAction = toggleEdit);
		actions[0].label = editOrSaveLabel;
		actions[0].action = editOrSaveAction;
	}

	onMount(async () => {
		const { poem, note } = await PoemGoogleDriveStorageDriver.loadPoem({
			name: $currentPoemName,
			poemUri: $currentPoemUri,
			noteUri: $currentPoemNoteUri
		});
		$currentPoemBody = poem.body;
		$currentPoemNote = note;
		thinking = false;
	});

	async function toggleEdit() {
		editMode = true;
		$currentPoemUnsavedChanges = 'true';
	}

	async function save() {
		switch ($storageMode) {
			case 'gdrive':
				PoemGoogleDriveStorageDriver.updatePoem(
					{
						poem: {
							name: $currentPoemName,
							body: $currentPoemBody
						},
						note: $currentPoemNote
					},
					$currentPoemUri,
					$currentPoemNoteUri
				);
				break;
			case 'local':
				try {
					const newUris = (await PoemLocalStorageDriver.updatePoem(
						{
							poem: {
								name: $currentPoemName,
								body: $currentPoemBody
							},
							note: $currentPoemNote
						},
						$currentPoemUri,
						$currentPoemNoteUri
					)) as { newPoemUri: string; newNoteUri: string };
					$currentPoemUri = newUris.newPoemUri;
					$currentPoemNoteUri = newUris.newNoteUri;
				} catch (e: unknown) {
					alert(e);
				}
				break;
		}
		editMode = false;
		$currentPoemUnsavedChanges = 'false';
	}

	async function deletePoem() {
		if (confirm('Heads up! You sure want to delete this poem?')) {
			switch ($storageMode) {
				case 'gdrive':
					break;
				case 'local':
					PoemLocalStorageDriver.deletePoem($currentPoemUri, $currentPoemNoteUri);
					clearCurrentPoemStorage();
					break;
			}
			await goto('/stash', { replaceState: false });
		}
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

	{#if $currentPoemUnsavedChanges === 'true' && editMode === false}
		<Toast isCloseable={false}>
			<div slot="toast-body">
				<p>You may have unsaved changes here. Save or discard them before proceeding.</p>
				<br />
				<button on:click={() => save()} class="action-button action-button--primary">
					Save them!
				</button>
				<button
					on:click={() => {
						$currentPoemUnsavedChanges = 'false';
						goto('/stash', { replaceState: false });
					}}
					class="action-button action-button--secondary"
				>
					Discard, I don't care!
				</button>
			</div>
		</Toast>
	{/if}
{/if}
