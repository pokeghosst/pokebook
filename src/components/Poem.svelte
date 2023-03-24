<script>
	import { font, poemAlignment } from "../stores/font";
	import { dayTheme } from "../stores/mode";

	export let props;
	export let editable;
</script>

<div class="notebook h-screen">
	<div
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden dark:bg-stone-900 dark:text-stone-100"
		contenteditable="true"
		bind:textContent={props.poemName}
	/>
	<div class="w-full">
		<textarea bind:value={props.poem} disabled={!editable} class="paper h-screen {$font} {$poemAlignment}" />
	</div>
</div>
