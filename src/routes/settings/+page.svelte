<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { Browser } from '@capacitor/browser';
	import { CapacitorHttp } from '@capacitor/core';
	import {
		PUBLIC_POKEDRIVE_BASE_URL
	} from '$env/static/public';

	let storageMode = null;
	let font = null;
	let dayTheme = null;
	let nightTheme = null;
	let poemAlignment = null;
	let gDriveAuth = false;

	$: if (storageMode != null) {
		Preferences.set({
			key: 'storage_mode',
			value: storageMode
		});
	}

	$: if (font != null) {
		Preferences.set({
			key: 'notebook_font',
			value: font
		});
	}

	$: if (dayTheme != null) {
		Preferences.set({
			key: 'day_theme',
			value: dayTheme
		});
	}

	$: if (nightTheme != null) {
		Preferences.set({
			key: 'night_theme',
			value: nightTheme
		});
	}

	$: if (poemAlignment != null) {
		Preferences.set({
			key: 'poem_alignment',
			value: poemAlignment
		});
	}

	onMount(async () => {
		const storageModePref = await Preferences.get({ key: 'storage_mode' });
		storageMode = storageModePref.value || 'local';
		const gDriveAuthPref = await Preferences.get({ key: 'gdrive_auth' });
		gDriveAuth = gDriveAuthPref.value || 'false';
		const fontPref = await Preferences.get({ key: 'notebook_font' });
		font = fontPref.value || 'halogen';
		const dayThemePref = await Preferences.get({ key: 'day_theme' });
		dayTheme = dayThemePref.value || 'vanilla';
		const nightThemePref = await Preferences.get({ key: 'night_theme' });
		nightTheme = nightThemePref.value || 'chocolate';
		const poemAlignmentPref = await Preferences.get({ key: 'poem_alignment' });
		poemAlignment = poemAlignmentPref.value || 'text-left';
	});

	async function authorize() {
		await Browser.open({ url: `${PUBLIC_POKEDRIVE_BASE_URL}/auth`});
	}

	function gDriveLogout() {
		// TODO: Don't forget to actually log out!
		if (confirm('You sure?')) {
			Preferences.set({
				key: 'gdrive_auth',
				value: 'false'
			});
			storageMode = 'local';
			location.reload();
		}
	}

	const fonts = [
		{ family: 'halogen', displayName: 'Halogen (MC)' },
		{ family: 'hashtag', displayName: 'Hashtag (Sayori)' },
		{ family: 'ammys', displayName: 'Ammys Handwriting (Natsuki)' },
		{ family: 'journal', displayName: 'Journal (Monika)' },
		{ family: 'damagrafik', displayName: 'Damagrafik Script (Yuri Act 2)' },
		{ family: 'jphand', displayName: 'JP Hand (Yuri)' },
		{ family: 'arial', displayName: 'Arial' },
		{ family: 'oldattic', displayName: 'Times Old Attic Bold' },
		{ family: 'crimson', displayName: 'Crimson Roman' },
		{ family: 'comic', displayName: 'Comic Sans MS' }
	];

	const alignments = [
		{ alignmentClass: 'text-left', displayName: 'Left' },
		{ alignmentClass: 'text-center', displayName: 'Centered' },
		{ alignmentClass: 'text-right', displayName: 'Right' }
	];

	const dayThemes = [
		{ themeClass: 'vanilla', displayName: 'Plain Vanilla' },
		{ themeClass: 'strawberry', displayName: 'Strawberry Sundae' },
		{ themeClass: 'lemon', displayName: 'Lemon Tart' },
		{ themeClass: 'cookie', displayName: 'Cookie Dough' },
		{ themeClass: 'cherry', displayName: 'Cherry Blossom' }
	];

	const nightThemes = [
		{ themeClass: 'chocolate', displayName: 'Chocolate' },
		{ themeClass: 'black-lobelia', displayName: 'Black Lobelia' },
		{ themeClass: 'red-velvet', displayName: 'Red Velvet' }
	];

	const storageOptions = [
		{ storage: 'gdrive', displayName: 'Google Drive' },
		{ storage: 'local', displayName: 'Local Storage' }
	];
</script>

<div class="w-11/12 mt-10 mx-auto">
	<div class="mb-5">
		<label for="font">Notebook font:</label>

		<select bind:value={font}>
			{#each fonts as selected_font}
				<option value={selected_font.family}>
					{selected_font.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="font">Poem alignment:</label>

		<select bind:value={poemAlignment}>
			{#each alignments as alignment}
				<option value={alignment.alignmentClass}>
					{alignment.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="dayTheme">Day theme:</label>

		<select
			bind:value={dayTheme}
			on:change={() => {
				if (!document.documentElement.classList.contains('dark')) {
					document.documentElement.classList.value = dayTheme;
				}
			}}
		>
			{#each dayThemes as theme}
				<option value={theme.themeClass}>
					{theme.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="nightTheme">Night theme:</label>

		<select
			bind:value={nightTheme}
			on:change={() => {
				if (document.documentElement.classList.contains('dark')) {
					document.documentElement.classList.value = 'dark ' + nightTheme;
				}
			}}
		>
			{#each nightThemes as theme}
				<option value={theme.themeClass}>
					{theme.displayName}
				</option>
			{/each}
		</select>
	</div>
	<div class="mb-5">
		<label for="storageMode">Storage:</label>

		<select
			bind:value={storageMode}
			on:change={() => {
				if (storageMode == 'gdrive') {
					if (gDriveAuth == 'false') {
						if (
							confirm('Heads up! You will be redirected to log in with your Google account. Oke?')
						) {
							authorize();
						} else {
							storageMode = 'local';
						}
					}
				}
			}}
		>
			{#each storageOptions as mode}
				<option value={mode.storage}>
					{mode.displayName}
				</option>
			{/each}
		</select>
		{#if storageMode == 'gdrive'}
			<button on:click={() => gDriveLogout()}>Log out</button>
		{/if}
	</div>
</div>
