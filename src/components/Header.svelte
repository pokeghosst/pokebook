<script>
	import { t } from '$lib/translations';
	import { isPokehelpActive } from '../lib/stores/pokehelpMode';
	import { darkMode } from '../lib/stores/darkMode';
	import MobileNav from './Sidebar.svelte';
	import Pencil from './svg/Pencil.svelte';
	import Moon from './svg/Moon.svelte';
	import { navMenuItems } from '$lib/constants/NavMenuItems';
	import BurgerMenu from './svg/BurgerMenu.svelte';
	import { isSidebarOpen } from '../lib/stores/isSidebarOpen';

	async function toggleDarkMode() {
		$darkMode === 'dark' ? ($darkMode = '') : ($darkMode = 'dark');
	}

	function togglePokeHelp() {
		$isPokehelpActive == 'true' ? ($isPokehelpActive = 'false') : ($isPokehelpActive = 'true');
	}

	function toggleMenu() {
		$isSidebarOpen === 'true' ? ($isSidebarOpen = 'false') : ($isSidebarOpen = 'true');
	}

	function closeMenu() {
		$isSidebarOpen = 'false';
	}
</script>

<div class="header-nav-wrapper">
	<button on:click={toggleMenu}>
		<BurgerMenu />
	</button>
	<!-- <a href="/" class="logo">{$t('menu.logo')}</a> -->
	<!-- <ul class="header-nav">
		{#each navMenuItems as item}
			<li><a href={item.url}>{$t(item.label)}</a></li>
		{/each}
	</ul> -->
	<div class="header-icons">
		<button on:click={() => togglePokeHelp()}><Pencil /></button>
		<button on:click={() => toggleDarkMode()}><Moon /></button>
	</div>
</div>
