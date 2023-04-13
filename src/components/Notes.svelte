<script>
	import { onMount } from 'svelte';
	import { font } from '../stores/font';
	import { dayTheme } from '../stores/mode';

	export let props;
	export let editable;

	let lines;
	let noteTextarea;
	let markerLetter;

	onMount(() => {
		lines = props.note.split('\n');
		noteTextarea = document.getElementById('note-textarea');
		autoHeight();
	});

	$: lines = props.note.split('\n');

	function updateTextareaHeight() {
		autoHeight();
	}

	function autoHeight() {
		let deFactoLines = lines.length;
		const charWidth = markerLetter.scrollWidth;
		lines.forEach((line) => {
			if (line.length * charWidth > noteTextarea.scrollWidth) {
				deFactoLines += Math.round((line.length * charWidth) / noteTextarea.scrollWidth) - 1;
			}
		});

		// Three lines to have some space
		const linesHeight = (deFactoLines + 3) * 32;
		noteTextarea.style.height = `${linesHeight}px`;
	}
</script>

<span bind:this={markerLetter} class="{$font} absolute left-[-9999px]">m</span>
<div class="notebook">
	<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
	<div class="w-full">
		<textarea
			bind:value={props.note}
			on:keyup={updateTextareaHeight}
			disabled={!editable}
			class="paper rounded-none overflow-y-hidden resize-none {$font} min-h-[480px]"
			id="note-textarea"
		/>
	</div>
</div>
