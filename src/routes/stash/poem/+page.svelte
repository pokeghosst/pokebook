<script>
	import { onMount } from 'svelte';
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

	let gDriveUuidPref;

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
							location.reload();
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
							location.reload();
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
		// const poemName = poemUri.split('/')[3].split('_')[0];
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
					alert(
						`Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: Error code ${response.status} Additional information: ${response.data}`
					);
				}
				thinking = false;
				break;
			case 'local':
				const oldPoemUri = poemUri;
				const oldNoteUri = `${oldPoemUri.split('.')[0]}_note.txt`;
				const newPoemUri = poemUri.replace(
					new RegExp(poemUri.split('poems/')[1].split('_')[0], 'i'),
					poemProps.poemName
				);
				const newNoteUri = `${newPoemUri.split('.')[0]}_note.txt`;
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
						alert(
							`Something went wrong! But don't fret. First, try to re-login with your Google Account. If it doesn't help, report this problem with the following info: Error code ${response.status} Additional information: ${response.data}`
						);
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
{ unsavedChanges }
<div
	class="toolbelt w-11/12 pt-5 md:pt-0 text-center md:text-right mx-auto"
	use:preventTabClose={editMode}
>
	{#if unsavedChanges}
		<div class="block text-center">
			<p class="mb-1 font-bold mr-2">
				You may have unsaved changes here. Save or discard them before proceeding.
			</p>
			<button
				on:click={save}
				class="mb-1 cursor-pointer underline font-bold decoration-dotted decoration-1 hover:no-underline mr-2"
			>
				Save them!
			</button>
			<button
				on:click={() => {
					discard();
					location.reload();
				}}
				class="mb-1 cursor-pointer underline font-bold decoration-dotted decoration-1 hover:no-underline mr-2"
			>
				Meh, I don't care.
			</button>
		</div>
	{/if}
	<button
		on:click={() => generateImage(poemProps.poemName)}
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline md:inline-block mr-2"
		>Export as image</button
	>
	{#if !editMode && !unsavedChanges}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block mr-2"
			on:click={toggleEdit}>Edit</button
		>
	{:else if !unsavedChanges}
		<button
			class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline inline-block mr-2"
			on:click={save}>Save</button
		>
	{/if}

	<button
		on:click={() => deletePoem()}
		class="mb-1 cursor-pointer underline decoration-dotted decoration-1 hover:no-underline md:inline-block"
		>Forget poem</button
	>
</div>
{#if loaded}
	{#if poemProps != null && noteProps != null}
		<Workspace bind:poemProps bind:noteProps editable={editMode} />
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
