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
	import { onDestroy, onMount } from 'svelte';

	import hotkeys from 'hotkeys-js';

	import { darkMode } from '$lib/stores/darkMode';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';

	import Menu from 'lucide-svelte/icons/menu';
	import PencilRuler from 'lucide-svelte/icons/pencil-ruler';
	import Eclipse from 'lucide-svelte/icons/eclipse';

	onMount(() => {
		// TODO: Extract hotkey-related logic into separate function possibly
		hotkeys.filter = function () {
			return true;
		};
		hotkeys('ctrl+/, command+/', function () {
			toggleSidebar();
			return false;
		});
		hotkeys('ctrl+h, command+h', function () {
			togglePokeHelp();
			return false;
		});
	});

	onDestroy(() => {
		hotkeys.unbind();
	});

	async function toggleDarkMode() {
		$darkMode === 'dark' ? ($darkMode = '') : ($darkMode = 'dark');
	}

	function togglePokeHelp() {
		$isPokehelpActive === 'true' ? ($isPokehelpActive = 'false') : ($isPokehelpActive = 'true');
	}

	function toggleSidebar() {
		$isSidebarOpen === 'true' ? ($isSidebarOpen = 'false') : ($isSidebarOpen = 'true');
	}
</script>

<div class="header-nav-wrapper">
	<button onclick={toggleSidebar}>
		<Menu />
	</button>
	<div class="header-icons">
		<button onclick={() => togglePokeHelp()}><PencilRuler strokeWidth={1.7} /></button>
		<button onclick={() => toggleDarkMode()}><Eclipse strokeWidth={1.7} /></button>
	</div>
</div>
