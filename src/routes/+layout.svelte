<script lang="ts">
	import { darkMode } from '../lib/stores/darkMode';
	import { dayTheme } from '../lib/stores/dayTheme';
	import { nightTheme } from '../lib/stores/nightTheme';
	import { onDestroy, onMount } from 'svelte';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Router, Route, useFocus } from 'svelte-navigator';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import Sidebar from '../components/Sidebar.svelte';
	import DraftPoem from '../pages/DraftPoem.svelte';
	import PoemStash from '../pages/PoemStash.svelte';
	import Header from '../components/Header.svelte';
	import Settings from '../pages/Settings.svelte';
	import PoemPage from '../pages/PoemPage.svelte';
	import PokeLab from '../pages/PokeLab.svelte';

	$: $darkMode, updateTheme();

	onMount(() => {
		updateTheme();
	});

	function updateTheme() {
		try {
			document.documentElement.className = '';
			if ($darkMode !== '') {
				document.documentElement.classList.add($darkMode || '');
				document.documentElement.classList.add($nightTheme || 'chocolate');
				StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
			} else {
				document.documentElement.classList.add($dayTheme || 'vanilla');
				StatusBar.setStyle({ style: Style.Light }).catch(() => {});
			}
		} catch (e) {}
	}
</script>

<Router>
	<Sidebar />
	<div class="main-wrapper {$isSidebarOpen === 'true' ? 'l-sidebar-open' : ''}">
		<main>
			<div>
				<Header />
				<Route path="/">
					<h2 class="sr-only">Poem Draft</h2>
					<DraftPoem />
				</Route>
				<Route path="/stash">
					<h2 class="sr-only">Poem Stash</h2>
					<PoemStash />
				</Route>
				<Route path="/stash/poem">
					<h2 class="sr-only">Individual poem page</h2>
					<PoemPage />
				</Route>
				<Route path="/settings">
					<h2 class="sr-only">Settings</h2>
					<Settings />
				</Route>
				<Route path="/settings">
					<h2 class="sr-only">Poke!Lab</h2>
					<PokeLab />
				</Route>
			</div>
		</main>
	</div>
</Router>
<slot/>
