<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	import { darkMode } from '../stores/mode';

	if ($darkMode) {
		document.documentElement.classList.add($darkMode);
	}
</script>

<Header />
<slot />
