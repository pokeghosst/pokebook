<script lang="ts">
	import { darkMode } from '../stores/darkMode';
	import { dayTheme } from '../stores/dayTheme';
	import { nightTheme } from '../stores/nightTheme';

	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';

	import { onMount } from 'svelte';
	import { StatusBar, Style } from '@capacitor/status-bar';

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

<div class="main-wrapper">
	<main>
		<Header />
		<slot />
	</main>

	<footer>
		<Footer />
	</footer>
</div>
