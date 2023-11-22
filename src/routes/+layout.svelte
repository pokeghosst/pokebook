<script lang="ts">
	import { darkMode } from '../lib/stores/darkMode';
	import { dayTheme } from '../lib/stores/dayTheme';
	import { nightTheme } from '../lib/stores/nightTheme';
	import Header from '../components/Header.svelte';
	import { onMount } from 'svelte';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { isSidebarOpen } from '../lib/stores/isSidebarOpen';
	import Sidebar from '../components/Sidebar.svelte';

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

<Sidebar />
<div class="main-wrapper {$isSidebarOpen === 'true' ? 'l-sidebar-open' : ''}">
	<main>
		<div>
			<Header />
			<slot />
		</div>
	</main>
</div>
