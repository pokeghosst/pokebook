<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2023-2024, 2026 Pokeghost.

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
	import { activeLanguage } from '$lib/stores/activeLanguage';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { nightTheme } from '$lib/stores/nightTheme';
	import { themeMode } from '$lib/stores/themeMode';
	import { t } from '$lib/translations';
	import { GLOBAL_TOAST_POSITION, GLOBAL_TOAST_STYLE } from '$lib/util/constants';
	import { themeModes } from 'lib//constants/themeModes';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import SettingsSelect from '../../components/SettingsSelect.svelte';

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
		parameterName="themeMode"
		labelName={$t('settings.themeMode')}
		bind:bindParameter={$themeMode}
		options={themeModes}
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
		parameterName="language"
		labelName={$t('settings.language')}
		bind:bindParameter={$activeLanguage}
		options={localizationLanguages}
		localizeLabel={false}
	/>
</div>
