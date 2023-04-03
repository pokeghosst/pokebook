<script>
	import { font, poemAlignment } from "../stores/font";

	export let props;
	export let editable;

	function preventChars(event) {
		const forbiddenChars = /_/g;
		props.poemName = props.poemName.replace(forbiddenChars, '');
	}
</script>

<div class="notebook h-screen" id="poem-notebook">
	<input
		class="top text-white leading-[50px] pl-5 font-bold overflow-hidden"
		disabled="{!editable}"
		bind:value={props.poemName}
		on:input={preventChars}
	/>
	<div class="w-full">
		<textarea bind:value={props.poem} disabled={!editable} class="paper h-screen rounded-none {$font} {$poemAlignment}" id="poem-textarea" />
	</div>
</div>
