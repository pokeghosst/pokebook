<script>
	import { t } from '$lib/translations';
	import { isPokehelpActive } from '../stores/pokehelpMode';
	import { darkMode } from '../stores/darkMode';
	import MobileNav from './MobileNav.svelte';
	import Pencil from './svg/Pencil.svelte';
	import Moon from './svg/Moon.svelte';
	import { navMenuItems } from '$lib/constants/NavMenuItems';

	async function toggleDarkMode() {
		$darkMode === 'dark' ? ($darkMode = '') : ($darkMode = 'dark');
	}

	function togglePokeHelp() {
		$isPokehelpActive == 'true' ? ($isPokehelpActive = 'false') : ($isPokehelpActive = 'true');
	}
</script>

<div class="header-nav-wrapper">
	<MobileNav />
	<a href="/" class="logo">{$t('menu.logo')}</a>
	<ul class="header-nav">
		{#each navMenuItems as item}
			<li><a href={item.url}>{$t(item.label)}</a></li>
		{/each}
	</ul>
	<div class="header-icons">
		<button on:click={() => togglePokeHelp()}><Pencil /></button>
		<button on:click={() => toggleDarkMode()}><Moon /></button>
	</div>
</div>
