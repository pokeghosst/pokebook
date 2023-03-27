<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	import { darkMode } from '../stores/mode';
	import { dayTheme, nightTheme } from '../stores/mode';

	if ($darkMode) {
		document.documentElement.classList.add($darkMode);
		document.documentElement.classList.add($nightTheme);
	} else {
		document.documentElement.classList.add($dayTheme);
	}
</script>

<Header />
<slot />
