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
	import { Capacitor } from '@capacitor/core';
	import { StatusBar } from '@capacitor/status-bar';
	import { Toaster } from 'svelte-french-toast';
	import { Modals, closeModal } from 'svelte-modals';
	import { App } from '@capacitor/app';

	import { usePreferences } from 'lib/hooks/usePreferences.svelte';

	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { setContext } from 'svelte';

	let dayTheme = usePreferences('day_theme', 'neo-day');
	let nightTheme = usePreferences('night_theme', 'neo-night');
	let darkMode = usePreferences('dark_mode', '');
	let isSidebarOpen = usePreferences('sidebar_open', 'false');
	let isPokehelpActive = usePreferences('pokehelp_active', 'false');

	setContext('pokehelp', isPokehelpActive);

	$effect(() => {
		updateTheme();
	});

	function rgbToHex(r: number, g: number, b: number) {
		return (
			'#' +
			[r, g, b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	}

	function updateTheme() {
		console.log('updating theme');
		document.documentElement.className = '';
		if (darkMode.value !== '') {
			document.documentElement.classList.add(darkMode.value || '');
			document.documentElement.classList.add(nightTheme.value || 'chocolate');
		} else {
			document.documentElement.classList.add(dayTheme.value || 'vanilla');
		}
		// I'm not a big fan of this idea but it's better than an ugly empty bar so it'll do for now
		if (Capacitor.isNativePlatform()) {
			const backgroundColorValues = getComputedStyle(document.body)
				.getPropertyValue('background-color')
				.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			const [, red, green, blue] = backgroundColorValues!.map(Number);
			const backgroundColorHex = rgbToHex(red, green, blue);
			StatusBar.setBackgroundColor({ color: backgroundColorHex });
		}
	}

	async function toggleDarkMode() {
		console.log(darkMode.value);
		darkMode.value = darkMode.value === 'dark' ? '' : 'dark';
		console.log(darkMode.value);
	}

	function togglePokeHelp() {
		isPokehelpActive.value = isPokehelpActive.value === 'true' ? 'false' : 'true';
	}

	function toggleSidebar() {
		isSidebarOpen.value = isSidebarOpen.value === 'true' ? 'false' : 'true';
	}

	App.addListener('backButton', (_) => {
		window.history.back();
	});
</script>

<Modals>
	<div
		slot="backdrop"
		class="backdrop"
		onclick={closeModal}
		onkeydown={closeModal}
		role="button"
		tabindex="0"
	></div>
</Modals>

<Toaster />
<Sidebar />
<div class="main-wrapper {isSidebarOpen.value === 'true' ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header {toggleSidebar} {togglePokeHelp} {toggleDarkMode} />
			<slot />
		</div>
	</main>
</div>
