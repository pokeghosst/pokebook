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
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { Browser } from '@capacitor/browser';
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import toast from 'svelte-french-toast';

	import { Preferences } from '$lib/plugins/Preferences';

	import { dropboxLogout, getDropboxAuthUrl } from '$lib/driver/PoemDropboxStorageDriver';
	import { activeLanguage } from '$lib/stores/activeLanguage';
	import { darkMode } from '$lib/stores/darkMode';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { nightTheme } from '$lib/stores/nightTheme';
	import { storageMode } from '$lib/stores/storageMode';

	import { dayThemes } from '$lib/constants/DayThemes';
	import { localizationLanguages } from '$lib/constants/LocalizationLanguages';
	import { nightThemes } from '$lib/constants/NightThemes';
	import { storageOptions } from '$lib/constants/StorageOptions';
	import {
		getGoogleDriveAuthUrl,
		googleDriveLogout
	} from '$lib/driver/PoemGoogleDriveStorageDriver';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

	import SettingsSelect from '../../components/SettingsSelect.svelte';

	$: $dayTheme, setDayTheme();
	$: $nightTheme, setNightTheme();

	function setDayTheme() {
		if ($darkMode === '') {
			document.documentElement.className = '';
			document.documentElement.classList.add($dayTheme || 'vanilla');
			if (Capacitor.isNativePlatform()) {
				StatusBar.setStyle({ style: Style.Light });
			}
		}
	}

	function setNightTheme() {
		if ($darkMode === 'dark') {
			document.documentElement.className = '';
			document.documentElement.classList.add($darkMode || '');
			document.documentElement.classList.add($nightTheme || 'chocolate');
			if (Capacitor.isNativePlatform()) {
				StatusBar.setStyle({ style: Style.Dark });
			}
		}
	}

	function getCloudAuthUrlPromise(storage: string) {
		Preferences.set({ key: 'poem_list_request_timestamp', value: Date.now().toString() });
		switch (storage) {
			case 'dropbox':
				return getDropboxAuthUrl();
			case 'google':
				return getGoogleDriveAuthUrl();
			default:
				throw new Error();
		}
	}

	async function getCloudLogoutPromise(storage: string) {
		switch (storage) {
			case 'dropbox':
				return await dropboxLogout();
			case 'google':
				return await googleDriveLogout();
			default:
				throw new Error();
		}
	}

	onMount(() => {
		const authStatus = $page.url.searchParams.get('status');
		if (authStatus)
			switch (authStatus) {
				case 'ok':
					toast.success('Signed in successfully!', {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					});
					break;
				case 'authorizationError':
					toast.error($t('errors.authorization'), {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					});
					break;
				default:
					toast.error($t('errors.unknown'), {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					});
			}
	});
</script>

<div class="settings-container">
	<SettingsSelect
		parameterName="dayTheme"
		labelName={$t('settings.dayTheme')}
		bind:bindParameter={$dayTheme}
		options={dayThemes}
	/>
	<SettingsSelect
		parameterName="nightTheme"
		labelName={$t('settings.nightTheme')}
		bind:bindParameter={$nightTheme}
		options={nightThemes}
	/>
	{#if !Capacitor.isNativePlatform()}
		<SettingsSelect
			parameterName="storageMode"
			labelName={$t('settings.storage')}
			bind:bindParameter={$storageMode}
			options={storageOptions}
		/>
	{/if}
	{#if $storageMode !== 'local'}
		<button
			on:click={async () =>
				await toast.promise(
					getCloudAuthUrlPromise($storageMode).then((url) => {
						Browser.open({ url: url, windowName: '_self' });
					}),
					{
						loading: `${$t('toasts.thingsAreHappening')}`,
						success: `${$t('toasts.redirecting')}`,
						error: `${$t('errors.unknown')}`
					},
					{ position: GLOBAL_TOAST_POSITION, style: GLOBAL_TOAST_STYLE }
				)}
			class="action-button action-button--secondary"
			>{$t('settings.login')} {$t(`settings.${$storageMode}`)}</button
		>
		<button
			on:click={async () => {
				await toast.promise(
					getCloudLogoutPromise($storageMode),
					{
						loading: `${$t('toasts.signingOut')}`,
						success: `${$t('toasts.signedOutOk')}`,
						error: `${$t('errors.signOutError')}`
					},
					{ position: GLOBAL_TOAST_POSITION, style: GLOBAL_TOAST_STYLE }
				);
				$storageMode = 'local';
			}}
			class="action-button action-button--secondary"
			>{$t('settings.logout')} {$t(`settings.${$storageMode}`)}</button
		>
	{/if}
	<SettingsSelect
		parameterName="language"
		labelName={$t('settings.language')}
		bind:bindParameter={$activeLanguage}
		options={localizationLanguages}
		localizeLabel={false}
	/>
</div>
