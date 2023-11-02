<script>
	import { onMount } from 'svelte';
	import { Preferences } from '@capacitor/preferences';
	import { Browser } from '@capacitor/browser';
	import { CapacitorHttp } from '@capacitor/core';
	import { PUBLIC_POKEDRIVE_BASE_URL, PUBLIC_POKEBOOK_BASE_URL } from '$env/static/public';
	import { v4 as uuidv4 } from 'uuid';
	import Select from '../../components/Select.svelte';
	import { t } from '$lib/translations';
	import { activeLang } from '../../stores/lang';

	let storageMode = null;
	let font = null;
	let dayTheme = null;
	let nightTheme = null;
	let poemAlignment = null;
	let gDriveAuth = false;

	const alignments = [
		{ value: 'text-left', label: $t('settings.left') },
		{ value: 'text-center', label: $t('settings.center') },
		{ value: 'text-right', label: $t('settings.right') }
	];

	const dayThemes = [
		{ value: 'vanilla', label: $t('themes.vanilla') },
		{ value: 'strawberry', label: $t('themes.strawberry') },
		{ value: 'lemon', label: $t('themes.lemon') },
		{ value: 'cookie', label: $t('themes.cookie') },
		{ value: 'cherry', label: $t('themes.cherry') },
		{ value: 'coral', label: $t('themes.coral') }
	];

	const nightThemes = [
		{ value: 'chocolate', label: $t('themes.chocolate') },
		{ value: 'black-lobelia', label: $t('themes.blackLobelia') },
		{ value: 'red-velvet', label: $t('themes.redVelvet') },
		{ value: 'terminal', label: $t('themes.terminal') }
	];

	const storageModes = [
		{ value: 'gdrive', label: $t('settings.gdrive') },
		{ value: 'local', label: $t('settings.local') }
	];

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'ja', label: '日本語' },
		{ value: 'es', label: 'Español' }
	];

	$: if (storageMode != null) {
		Preferences.set({
			key: 'storage_mode',
			value: storageMode
		});
		if (storageMode == 'gdrive') {
			if (gDriveAuth == 'false') {
				if (confirm($t('popups.gDriveRedirect'))) {
					authorize();
				} else {
					storageMode = 'local';
					Preferences.set({
						key: 'storage_mode',
						value: storageMode
					});
				}
			}
		}
	}

	$: if (font != null) {
		Preferences.set({
			key: 'notebook_font',
			value: font
		});
	}

	// TODO: Bug related to reacitivy when reading classList. Might be useful to refactor this part completely if possible
	$: if (dayTheme != null) {
		Preferences.set({
			key: 'day_theme',
			value: dayTheme
		});
		if (!document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.value = dayTheme;
		}
	}

	$: if (nightTheme != null) {
		Preferences.set({
			key: 'night_theme',
			value: nightTheme
		});
		if (document.documentElement.classList.contains('dark')) {
			document.documentElement.classList.value = 'dark ' + nightTheme;
		}
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
		const gDriveUuid = uuidv4();
		Preferences.set({
			key: 'gdrive_uuid',
			value: gDriveUuid
		});
		await Browser.open({
			url: `${PUBLIC_POKEDRIVE_BASE_URL}/auth?uuid=${gDriveUuid}&pokebook_base=${PUBLIC_POKEBOOK_BASE_URL}`,
			windowName: '_self'
		});
	}

	async function gDriveLogout() {
		if (confirm('You sure?')) {
			Preferences.set({
				key: 'gdrive_auth',
				value: 'false'
			});
			const gDriveUuidPref = await Preferences.get({ key: 'gdrive_uuid' });
			const options = {
				url: `${PUBLIC_POKEDRIVE_BASE_URL}/logout`,
				headers: {
					Authorization: gDriveUuidPref.value
				}
			};
			const response = await CapacitorHttp.request({ ...options, method: 'GET' });
			if (response.status == 400) {
				alert($t('popups.somethingWrong') + `\n ${response.status} \n ${response.data}`);
			}
			Preferences.remove({ key: 'gdrive_uuid' });
			storageMode = 'local';
			location.reload();
		}
	}

	const fonts = [
		{ value: 'halogen', label: 'Halogen (MC)' },
		{ value: 'hashtag', label: 'Hashtag (Sayori)' },
		{ value: 'ammys', label: 'Ammys Handwriting (Natsuki)' },
		{ value: 'journal', label: 'Journal (Monika)' },
		{ value: 'damagrafik', label: 'Damagrafik Script (Yuri Act 2)' },
		{ value: 'jphand', label: 'JP Hand (Yuri)' },
		{ value: 'arial', label: 'Arial' },
		{ value: 'oldattic', label: 'Times Old Attic Bold' },
		{ value: 'crimson', label: 'Crimson Roman' },
		{ value: 'comic', label: 'Comic Sans MS' },
		{ value: 'consolas', label: 'Consolas' },
		{ value: 'lucida', label: 'Lucida Console' }
	];
</script>

<div class="w-11/12 mt-10 mx-auto">
	<Select
		parameterName="font"
		labelName={$t('settings.font')}
		bind:bindParameter={font}
		options={fonts}
	/>
	<Select
		parameterName="alignment"
		labelName={$t('settings.alignment')}
		bind:bindParameter={poemAlignment}
		options={alignments}
	/>
	<Select
		parameterName="dayTheme"
		labelName={$t('settings.dayTheme')}
		bind:bindParameter={dayTheme}
		options={dayThemes}
	/>
	<Select
		parameterName="nightTheme"
		labelName={$t('settings.nightTheme')}
		bind:bindParameter={nightTheme}
		options={nightThemes}
	/>
	<Select
		parameterName="storageMode"
		labelName={$t('settings.storage')}
		bind:bindParameter={storageMode}
		options={storageModes}
	/>
	<Select
		parameterName="language"
		labelName={$t('settings.language')}
		bind:bindParameter={$activeLang}
		options={languages}
	/>
	{#if storageMode == 'gdrive'}
		<button on:click={() => gDriveLogout()}>{$t('settings.logout')}</button>
	{/if}
</div>
