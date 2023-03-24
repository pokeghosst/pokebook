<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	import { darkMode } from '../stores/mode';
	import { dayTheme } from '../stores/mode';

	document.documentElement.classList.add($dayTheme);

	if ($darkMode) {
		document.documentElement.classList.add($darkMode);
	}
</script>

<Header />
<slot />
