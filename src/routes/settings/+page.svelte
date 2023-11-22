<script lang="ts">
	import { t } from '$lib/translations';

	import { textJustificationSettings } from '$lib/constants/TextJustificationSettings';
	import { localizationLanguages } from '$lib/constants/LocalizationLanguages';
	import { storageOptions } from '$lib/constants/StorageOptions';
	import { nightThemes } from '$lib/constants/NightThemes';
	import { dayThemes } from '$lib/constants/DayThemes';
	import { padFonts } from '$lib/constants/PadFonts';

	import { activeLanguage } from '../../lib/stores/activeLanguage';
	import { storageMode } from '../../lib/stores/storageMode';
	import { writingPadFont } from '../../lib/stores/writingPadFont';
	import { poemPadJustification } from '../../lib/stores/poemPadJustification';
	import { dayTheme } from '../../lib/stores/dayTheme';
	import { nightTheme } from '../../lib/stores/nightTheme';
	import { darkMode } from '../../lib/stores/darkMode';

	import SettingsSelect from '../../components/SettingsSelect.svelte';

	import { StatusBar, Style } from '@capacitor/status-bar';

	$: $dayTheme, setDayTheme();
	$: $nightTheme, setNightTheme();

	function setDayTheme() {
		try {
			if ($darkMode === '') {
				document.documentElement.className = '';
				document.documentElement.classList.add($dayTheme || 'vanilla');
				StatusBar.setStyle({ style: Style.Light }).catch(() => {});
			}
		} catch (e) {}
	}

	function setNightTheme() {
		try {
			if ($darkMode === 'dark') {
				document.documentElement.className = '';
				document.documentElement.classList.add($darkMode || '');
				document.documentElement.classList.add($nightTheme || 'chocolate');
				StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
			}
		} catch (e) {}
	}
</script>

<div class="settings-container">
	<SettingsSelect
		parameterName="font"
		labelName={$t('settings.font')}
		bind:bindParameter={$writingPadFont}
		options={padFonts}
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
	/>
</div>
