<script>
	import { onMount, getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import Workspace from '../../../components/Workspace.svelte';
	import generateImage from '../../../util/poem2image';
	import Overlay from '../../../components/Overlay.svelte';
	import Skeleton from 'svelte-skeleton/Skeleton.svelte';
	import { preventTabClose } from '../../../util/preventTabClose';
	import { Filesystem, Encoding } from '@capacitor/filesystem';
	import { Preferences } from '@capacitor/preferences';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL } from '$env/static/public';
	import { t } from '$lib/translations';

	let editMode;

	let poemProps;
	let noteProps;

	let loaded = false;
	let thinking = false;
	let unsavedChanges = false;

	let storageMode;
	let poemUri = null;
	let noteUri = null;
	let gDrivePoemId = null;
	let gDrivePoemTime = null;

	let editOrSaveLabel = 'Edit poem';
	let editOrSaveAction = toggleEdit;

	let translationPromise = getContext('translationPromise');

	let actions = [
		{ action: editOrSaveAction, label: editOrSaveLabel },
		{ action: deletePoem, label: 'Forget poem' },
		// { action: generateImage, label: 'Export poem' }
	];

	let gDriveUuidPref;

	$: {
		editMode == true ? (editOrSaveLabel = 'Save poem') : (editOrSaveLabel = 'Edit poem');
		editMode == true ? (editOrSaveAction = save) : (editOrSaveAction = toggleEdit);
		actions[0].label = editOrSaveLabel;
		actions[0].action = editOrSaveAction;
	}

	$: if (poemProps) {
		Preferences.set({
			key: 'backup_poem_text',
			value: poemProps.poem
		});
		Preferences.set({
			key: 'backup_poem_name',
			value: poemProps.poemName
		});
	}

	$: if (noteProps) {
		Preferences.set({
			key: 'backup_poem_note',
			value: noteProps.note
		});
	}

	onMount(async () => {
		await translationPromise;
		editMode = false;
		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';
		const unsavedChangesPref = await Preferences.get({ key: 'unsaved_changes' });

		switch (storageMode) {
			case 'gdrive':
				gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });
				const gDrivePoemIdPref = await Preferences.get({ key: 'gdrive_poem_id' });
				gDrivePoemId = gDrivePoemIdPref.value;

				if (unsavedChangesPref.value == 'true') {
					const unsavedPoemIdPref = await Preferences.get({ key: 'unsaved_poem_id' });
					const unsavedPoemId = unsavedPoemIdPref.value;

					if (gDrivePoemId == unsavedPoemId) {
						unsavedChanges = true;
						loadBackup();
					} else {
						if (
							confirm(
								"Heads up! You're trying to edit a poem without properly saving another one? Proceed? Unsaved data will be lost!"
							)
						) {
							discard();
							goto('/stash', { replaceState: false });
						} else {
							Preferences.set({
								key: 'gdrive_poem_id',
								value: unsavedPoemId
							});
							loadBackup();
							unsavedChanges = true;
						}
					}
				} else {
					await loadPoemFromDrive();
				}
				break;
			case 'local':
				const poemUriPref = await Preferences.get({ key: 'current_poem_uri' });
				poemUri = poemUriPref.value;
				if (unsavedChangesPref.value == 'true') {
					const unsavedPoemUriPref = await Preferences.get({ key: 'unsaved_poem_uri' });
					const unsavedPoemUri = unsavedPoemUriPref.value;

					if (poemUri == unsavedPoemUri) {
						unsavedChanges = true;
						loadBackup();
					} else {
						if (
							confirm(
								"Heads up! You're trying to edit a poem without properly saving another one? Proceed? Unsaved data will be lost!"
							)
						) {
							discard();
							goto('/stash', { replaceState: false });
						} else {
							Preferences.set({
								key: 'current_poem_uri',
								value: unsavedPoemUri
							});
							poemUri = unsavedPoemUri;
							loadBackup();
							unsavedChanges = true;
						}
					}
				} else {
					await loadLocal();
				}
				break;
		}
		loaded = true;
	});

	async function toggleEdit() {
		editMode = !editMode;
		Preferences.set({
			key: 'unsaved_changes',
			value: 'true'
		});
		if (storageMode == 'local') {
			Preferences.set({
				key: 'unsaved_poem_uri',
				value: poemUri
			});
		} else {
			Preferences.set({
				key: 'unsaved_poem_id',
				value: gDrivePoemId
			});
			Preferences.set({
				key: 'unsaved_poem_time',
				value: gDrivePoemTime
			});
		}
	}

	async function loadPoemFromDrive() {
		const options = {
			url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem/${gDrivePoemId}`,
			headers: {
				Authorization: gDriveUuidPref.value
			}
		};
		const response = await CapacitorHttp.request({ ...options, method: 'GET' });

		poemProps = {
			poem: response.data.poem,
			poemName: response.data.poem_name.split('_')[0]
		};
		noteProps = {
			note: response.data.note
		};
		gDrivePoemTime = response.data.poem_name.split('_').slice(1, 3).join('_');
	}

	async function loadLocal() {
		const contents = await Filesystem.readFile({
			path: poemUri,
			encoding: Encoding.UTF8
		});
		const poemName = poemUri.split('poems/')[1].split('_')[0];
		const noteUriSplit = poemUri.split('.txt');
		noteUri = `${noteUriSplit[0]}_note.txt`;
		const noteContents = await Filesystem.readFile({
			path: noteUri,
			encoding: Encoding.UTF8
		});

		poemProps = {
			poem: contents.data,
			poemName: poemName
		};
		noteProps = {
			note: noteContents.data
		};
		poemProps.poemName = poemProps.poemName.replace(/%20/g, ' ');
	}

	async function loadBackup() {
		const backupPoemText = await Preferences.get({ key: 'backup_poem_text' });
		const backupPoemName = await Preferences.get({ key: 'backup_poem_name' });
		const backupPoemNote = await Preferences.get({ key: 'backup_poem_note' });

		poemProps = {
			poem: backupPoemText.value,
			poemName: backupPoemName.value
		};

		noteProps = {
			note: backupPoemNote.value
		};

		if (storageMode == 'gdrive') {
			const gDrivePoemIdPref = await Preferences.get({ key: 'unsaved_poem_id' });
			gDrivePoemId = gDrivePoemIdPref.value;

			const gDrivePoemTimePref = await Preferences.get({ key: 'unsaved_poem_time' });
			gDrivePoemTime = gDrivePoemTimePref.value;
		}
	}

	async function save() {
		switch (storageMode) {
			case 'gdrive':
				thinking = true;
				const options = {
					url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem/${gDrivePoemId}`,
					headers: {
						Authorization: gDriveUuidPref.value
					},
					data: {
						poem_name: `${poemProps.poemName}_${gDrivePoemTime}`,
						poem_body: poemProps.poem,
						poem_note: noteProps.note
					}
				};

				const response = await CapacitorHttp.request({ ...options, method: 'PUT' });
				if (response.status === 200) {
					thinking = false;
				} else {
					alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
				}
				thinking = false;
				break;
			case 'local':
				const oldPoemUri = poemUri.replace(/ /g, '%20');
				const oldNoteUri = `${oldPoemUri.split('.txt')[0]}_note.txt`;
				const newPoemUri = poemUri
					.replace(new RegExp(poemUri.split('poems/')[1].split('_')[0], 'i'), poemProps.poemName)
					.replace(/ /g, '%20');
				const newNoteUri = `${newPoemUri.split('.txt')[0]}_note.txt`;
				await Filesystem.rename({
					from: oldPoemUri,
					to: newPoemUri
				});
				await Filesystem.writeFile({
					path: newPoemUri,
					data: poemProps.poem,
					encoding: Encoding.UTF8
				});
				await Filesystem.rename({
					from: oldNoteUri,
					to: newNoteUri
				});
				await Filesystem.writeFile({
					path: newNoteUri,
					data: noteProps.note,
					encoding: Encoding.UTF8
				});
				Preferences.set({
					key: 'unsaved_changes',
					value: 'false'
				});
				Preferences.set({
					key: 'current_poem_uri',
					value: newPoemUri
				});
				break;
		}
		editMode = false;
		discard();
	}

	function discard() {
		unsavedChanges = false;
		Preferences.set({
			key: 'unsaved_changes',
			value: 'false'
		});
		Preferences.remove({
			key: 'unsaved_poem_uri'
		});
		Preferences.remove({
			key: 'backup_poem_text'
		});
		Preferences.remove({
			key: 'backup_poem_name'
		});
		Preferences.remove({
			key: 'backup_poem_note'
		});
	}

	async function deletePoem() {
		if (confirm('Heads up! You sure want to delete this poem?')) {
			switch (storageMode) {
				case 'gdrive':
					thinking = true;
					const options = {
						url: `${PUBLIC_POKEDRIVE_BASE_URL}/v0/poem/${gDrivePoemId}`,
						headers: {
							Authorization: gDriveUuidPref.value
						}
					};
					const response = await CapacitorHttp.request({ ...options, method: 'DELETE' });

					if (response.status != 200) {
						alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
					} else {
						goto('/stash', { replaceState: false });
					}
					break;
				case 'local':
					Filesystem.deleteFile({
						path: poemUri
					});
					Filesystem.deleteFile({
						path: noteUri
					});
					goto('/stash', { replaceState: false });
					break;
			}
		}
	}
</script>

{#if thinking}
	<Overlay />
{/if}
<div class="toolbelt w-11/12 text-center md:text-right mx-auto" use:preventTabClose={editMode}>
	{#if unsavedChanges}
		<div class="block text-center">
			<p class="mb-5 mr-2">
				You may have unsaved changes here.<br />Save or discard them before proceeding.
			</p>
			<button on:click={save} class="action-button action-button--primary"> Save them! </button>
			<button
				on:click={() => {
					discard();
					goto('/stash', { replaceState: false });
				}}
				class="action-button action-button--secondary"
			>
				Discard, I don't care!
			</button>
		</div>
	{/if}
</div>
{#if loaded}
	{#if poemProps != null && noteProps != null}
		<Workspace bind:poemProps bind:noteProps editable={editMode} {actions} />
	{/if}
{:else}
	<div class="pt-10 flex items-center justify-center">
		<Skeleton>
			<rect width="100%" height="20" x="0" y="0" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="45" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="85" rx="5" ry="5" />
			<rect width="100%" height="20" x="0" y="125" rx="5" ry="5" />
		</Skeleton>
	</div>
{/if}
