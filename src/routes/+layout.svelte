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

	import { darkMode } from '$lib/stores/darkMode';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import { nightTheme } from '$lib/stores/nightTheme';

	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	$: $darkMode, updateTheme();

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
		document.documentElement.className = '';
		if ($darkMode !== '') {
			document.documentElement.classList.add($darkMode || '');
			document.documentElement.classList.add($nightTheme || 'chocolate');
		} else {
			document.documentElement.classList.add($dayTheme || 'vanilla');
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
</script>

<Modals>
	<div
		slot="backdrop"
		class="backdrop"
		on:click={closeModal}
		on:keydown
		role="button"
		tabindex="0"
	/>
</Modals>

<Toaster />
<Sidebar />
<div class="main-wrapper {$isSidebarOpen === 'true' ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			<slot />
		</div>
	</main>
</div>
