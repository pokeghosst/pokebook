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
	import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js';

	import SettingsSelect from '../../components/SettingsSelect.svelte';
	import { getPoem, listPoems } from '$lib/services/poems.service';

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

	function importPoems() {}

	async function exportPoems() {
		const poemList = await listPoems();

		const filePromises = poemList.map(async (meta) => {
			const poem = await getPoem(meta.id);
			if (!poem) return [];

			return [
				{
					data: JSON.stringify(poem, null, 2),
					filename: `poem_${poem.name}_${meta.createdAt}.json`
				}
			];
		});
		const files = (await Promise.all(filePromises)).flat();

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
	<div>
		<a
			href="{PUBLIC_POKEBOOK_SERVER_URL}/{appState.value.syncProvider}/auth"
			class="action-button action-button--secondary"
		>
			{$t('settings.login')} {$t(`settings.${appState.value.syncProvider}`)}</a
		>
	</div>
	<div class="settings-poem-actions">
		<button class="action-button action-button--secondary" onclick={exportPoems}
			>{$t('settings.export')}</button
		>
		<form>
			<button class="action-button action-button--secondary" onclick={importPoems}
				>{$t('settings.import')}</button
			>
		</form>
	</div>
</div>
