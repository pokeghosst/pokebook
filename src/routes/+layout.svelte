<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';

	import { darkMode } from '$lib/stores/darkMode';
	import { dayTheme } from '$lib/stores/dayTheme';
	import { isSidebarOpen } from '$lib/stores/isSidebarOpen';
	import { nightTheme } from '$lib/stores/nightTheme';

	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	$: $darkMode, updateTheme();

	function updateTheme() {
		document.documentElement.className = '';
		if ($darkMode !== '') {
			document.documentElement.classList.add($darkMode || '');
			document.documentElement.classList.add($nightTheme || 'chocolate');
			if (Capacitor.isNativePlatform()) {
				StatusBar.setStyle({ style: Style.Dark });
			}
		} else {
			document.documentElement.classList.add($dayTheme || 'vanilla');
			if (Capacitor.isNativePlatform()) {
				StatusBar.setStyle({ style: Style.Light });
			}
		}
	}
</script>

<Sidebar />
<div class="main-wrapper {$isSidebarOpen === 'true' ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			<slot />
		</div>
	</main>
</div>

<!-- <Router>
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
</Router> -->
