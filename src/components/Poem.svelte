<script>
	import { font, poemAlignment } from "../stores/font";

	export let props;
	export let editable;
</script>

<div class="notebook h-screen" id="poem-notebook">
	<div
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden"
		contenteditable="true"
		bind:textContent={props.poemName}
	/>
	<div class="w-full">
		<textarea bind:value={props.poem} disabled={!editable} class="paper h-screen rounded-none {$font} {$poemAlignment}" id="poem-textarea" />
	</div>
</div>
