<script>
	import { darkMode } from '$lib/stores/darkMode';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import { isPokehelpActive } from '$lib/stores/pokehelpMode';

	import BurgerMenu from './svg/BurgerMenu.svelte';
	import Moon from './svg/Moon.svelte';
	import Pencil from './svg/PencilRuler.svelte';

	async function toggleDarkMode() {
		$darkMode === 'dark' ? ($darkMode = '') : ($darkMode = 'dark');
	}

	function togglePokeHelp() {
		$isPokehelpActive === 'true' ? ($isPokehelpActive = 'false') : ($isPokehelpActive = 'true');
	}

	function toggleMenu() {
		$isSidebarOpen === 'true' ? ($isSidebarOpen = 'false') : ($isSidebarOpen = 'true');
	}
</script>

<div class="header-nav-wrapper">
	<button on:click={toggleMenu}>
		<BurgerMenu />
	</button>
	<div class="header-icons">
		<button on:click={() => togglePokeHelp()}><Pencil /></button>
		<button on:click={() => toggleDarkMode()}><Moon /></button>
	</div>
</div>
