<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
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

<div class="flex flex-col min-h-screen">
	<main class="flex-1">
		<Header />
		<slot />
	</main>
	
	<footer class="py-4">
	  <Footer/>
	</footer>
  </div>

