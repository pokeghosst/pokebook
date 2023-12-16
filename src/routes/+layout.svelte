<script lang="ts">
	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Toaster } from 'svelte-french-toast';

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
