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
	import { PUBLIC_POKEBOOK_SERVER_URL } from '$env/static/public';
	import appState from '$lib/AppState.svelte';
	import { dayThemes } from '$lib/constants/DayThemes';
	import { localizationLanguages } from '$lib/constants/LocalizationLanguages';
	import { nightThemes } from '$lib/constants/NightThemes';
	import { syncProviders } from '$lib/constants/syncProviders';
	import { t } from '$lib/translations';
	// import { page } from '$app/stores';
	// import { onMount } from 'svelte';

	// import { Browser } from '@capacitor/browser';
	// import { Capacitor } from '@capacitor/core';
	// import { StatusBar, Style } from '@capacitor/status-bar';
	// import toast from 'svelte-french-toast';

	// import { activeLanguage } from '$lib/stores/activeLanguage';
	// import { darkMode } from '$lib/stores/darkMode';
	// import { dayTheme } from '$lib/stores/dayTheme';
	// import { nightTheme } from '$lib/stores/nightTheme';
	// import { storageMode } from '$lib/stores/storageMode';

	// import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import SettingsSelect from '../../components/SettingsSelect.svelte';

	function updateDayTheme(value: string) {
		appState.value = { dayTheme: value };
	}

	function updateNightTheme(value: string) {
		appState.value = { nightTheme: value };
	}

	function updateSyncProvider(value: string) {
		appState.value = { syncProvider: value };
	}

	function updateLanguage(value: string) {
		appState.value = { activeLanguage: value };
	}

	// $: $dayTheme, setDayTheme();
	// $: $nightTheme, setNightTheme();

	// function getCloudAuthUrlPromise(storage: string) {
	// 	Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
	// 	switch (storage) {
	// 		case 'dropbox':
	// 			return getDropboxAuthUrl();
	// 		case 'google':
	// 			return getGoogleDriveAuthUrl();
	// 		default:
	// 			throw new Error();
	// 	}
	// }

	// async function getCloudLogoutPromise(storage: string) {
	// 	switch (storage) {
	// 		case 'dropbox':
	// 			return await dropboxLogout();
	// 		case 'google':
	// 			return await googleDriveLogout();
	// 		default:
	// 			throw new Error();
	// 	}
	// }

	// 	onMount(() => {
	// 		const authStatus = $page.url.searchParams.get('status');
	// 		if (authStatus)
	// 			switch (authStatus) {
	// 				case 'ok':
	// 					toast.success('Signed in successfully!', {
	// 						position: GLOBAL_TOAST_POSITION,
	// 						style: GLOBAL_TOAST_STYLE
	// 					});
	// 					break;
	// 				case 'authorizationError':
	// 					toast.error($t('errors.authorization'), {
	// 						position: GLOBAL_TOAST_POSITION,
	// 						style: GLOBAL_TOAST_STYLE
	// 					});
	// 					break;
	// 				default:
	// 					toast.error($t('errors.unknown'), {
	// 						position: GLOBAL_TOAST_POSITION,
	// 						style: GLOBAL_TOAST_STYLE
	// 					});
	// 			}
	// 	});
	//
</script>

<div class="settings-container">
	<SettingsSelect
		parameterName="dayTheme"
		labelName={$t('settings.dayTheme')}
		bindValue={appState.value.dayTheme}
		bindFunction={updateDayTheme}
		options={dayThemes}
	/>
	<SettingsSelect
		parameterName="nightTheme"
		labelName={$t('settings.nightTheme')}
		bindValue={appState.value.nightTheme}
		bindFunction={updateNightTheme}
		options={nightThemes}
	/>
	<SettingsSelect
		parameterName="language"
		labelName={$t('settings.language')}
		bindValue={appState.value.activeLanguage}
		bindFunction={updateLanguage}
		options={localizationLanguages}
		localizeLabel={false}
	/>
	<SettingsSelect
		parameterName="storageMode"
		labelName={$t('settings.storage')}
		bindValue={appState.value.syncProvider}
		bindFunction={updateSyncProvider}
		options={syncProviders}
	/>
	<a
		href="{PUBLIC_POKEBOOK_SERVER_URL}/{appState.value.syncProvider}/auth"
		class="action-button action-button--secondary"
	>
		{$t('settings.login')} {$t(`settings.${appState.value.syncProvider}`)}</a
	>
</div>
