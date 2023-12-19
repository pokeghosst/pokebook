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
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Browser } from '@capacitor/browser';

	import { activeLanguage } from '$lib/stores/activeLanguage';
	import { darkMode } from '$lib/stores/darkMode';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { nightTheme } from '$lib/stores/nightTheme';
	import { poemPadJustification } from '$lib/stores/poemPadJustification';
	import { storageMode } from '$lib/stores/storageMode';
	import { writingPadFont } from '$lib/stores/writingPadFont';

	import { dayThemes } from '$lib/constants/DayThemes';
	import { localizationLanguages } from '$lib/constants/LocalizationLanguages';
	import { nightThemes } from '$lib/constants/NightThemes';
	import { padFonts } from '$lib/constants/PadFonts';
	import { storageOptions } from '$lib/constants/StorageOptions';
	import { textJustificationSettings } from '$lib/constants/TextJustificationSettings';
	import { t } from '$lib/translations';
	import {
		getGoogleDriveAuthUrl,
		googleDriveLogout
	} from '$lib/driver/PoemGoogleDriveStorageDriver';

	import SettingsSelect from '../../components/SettingsSelect.svelte';
	import { error } from '@sveltejs/kit';
	import toast from 'svelte-french-toast';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';

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
</script>

<div class="settings-container">
	<SettingsSelect
		parameterName="font"
		labelName={$t('settings.font')}
		bind:bindParameter={$writingPadFont}
		options={padFonts}
		localizeLabel={false}
	/>
	<SettingsSelect
		parameterName="alignment"
		labelName={$t('settings.alignment')}
		bind:bindParameter={$poemPadJustification}
		options={textJustificationSettings}
	/>
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
	<SettingsSelect
		parameterName="storageMode"
		labelName={$t('settings.storage')}
		bind:bindParameter={$storageMode}
		options={storageOptions}
	/>
	<SettingsSelect
		parameterName="language"
		labelName={$t('settings.language')}
		bind:bindParameter={$activeLanguage}
		options={localizationLanguages}
		localizeLabel={false}
	/>
	<button
		on:click={() =>
			getGoogleDriveAuthUrl().then((url) => {
				Browser.open({ url: url });
			})}>Log in Google Drive</button
	>
	<br />
	<button
		on:click={() => {
			googleDriveLogout()
				.then(() =>
					toast.success('Logged out successfully', {
						position: GLOBAL_TOAST_POSITION,
						style: GLOBAL_TOAST_STYLE
					})
				)
				.catch((e) => {
					if (e instanceof Error) {
						toast.error($t(e.message), {
							position: GLOBAL_TOAST_POSITION,
							style: GLOBAL_TOAST_STYLE
						});
					}
				});
		}}>Log out of Google Drive</button
	>
</div>
