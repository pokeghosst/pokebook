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
	import { page } from '$app/stores';
	import { dayThemes } from '$lib/constants/DayThemes';
	import { localizationLanguages } from '$lib/constants/LocalizationLanguages';
	import { nightThemes } from '$lib/constants/NightThemes';
	import { dropboxLogout, getDropboxAuthUrl } from '$lib/driver/PoemDropboxStorageDriver';
	import {
		getGoogleDriveAuthUrl,
		googleDriveLogout
	} from '$lib/driver/PoemGoogleDriveStorageDriver';
	import { activeLanguage } from '$lib/stores/activeLanguage';
	import { darkMode } from '$lib/stores/darkMode';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { nightTheme } from '$lib/stores/nightTheme';
	import { storageMode } from '$lib/stores/storageMode';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import { Browser } from '@capacitor/browser';
	import { Capacitor } from '@capacitor/core';
	import { Preferences } from '@capacitor/preferences';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';
	import { storageOptions } from 'lib//constants/StorageOptions';
	import Poem from 'lib//models/Poem';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
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

	async function exportPoems() {
		const cachedPoems = await Poem.listFromCache($storageMode);

		const files = await Promise.all(
			cachedPoems.map(async (meta) => {
				const poem = await Poem.load(meta.id, $storageMode);
				const filename = `poem_${poem.name}_${meta.timestamp}.json`;
				const file = { ...poem, createdAt: meta.timestamp, updatedAt: meta.timestamp };

				return {
					data: JSON.stringify(file, null, 2),
					filename
				};
			})
		);

		const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
		const zipPromises = files.map(async (file) => {
			return zipWriter.add(file.filename, new TextReader(file.data));
		});

		await Promise.all(zipPromises);
		const blob = await zipWriter.close();

		Object.assign(document.createElement('a'), {
			download: `pokebook_poems_${Date.now()}.zip`,
			href: URL.createObjectURL(blob),
			textContent: 'Download zip file'
		}).click();
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

	<button class="action-button action-button--primary" on:click={exportPoems}
		>Export poems from current storage</button
	>
	<p style="margin-top: 1rem">
		Export now working? <a href="https://discord.gg/wQwVUUfxya" style="text-decoration: underline;"
			>Get help on Discord!</a
		>
	</p>
</div>
