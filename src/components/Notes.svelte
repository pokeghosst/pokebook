<script>
	import { onMount } from 'svelte';
	import { font } from '../stores/font';
	import { dayTheme } from '../stores/mode';

	export let props;
	export let editable;

	let lines;
	let noteTextarea;

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
		// Three lines to have some space
		const linesHeight = (lines.length + 3) * 32;
		noteTextarea.style.height = `${linesHeight}px`;
	}
</script>

<div class="notebook">
	<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
	<div class="w-full">
		<textarea
			bind:value={props.note}
			on:keyup={updateTextareaHeight}
			disabled={!editable}
			class="paper rounded-none overflow-y-hidden resize-none {$font}"
			id="note-textarea"
		/>
	</div>
</div>
