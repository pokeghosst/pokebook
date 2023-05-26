<script>
	import { onMount, tick } from 'svelte';
	import { font } from '../stores/font';
	import { dayTheme } from '../stores/mode';

	export let props;
	export let editable;

	let lines;
	let noteTextarea;
	let markerLetter;

	onMount(() => {
		lines = props.note.split('\n');
		autoResize();
	});

	$: lines = props.note.split('\n');
	$: lines, autoResize();

	async function autoResize() {
		await tick();
		const scrollPosition = window.scrollY;
		noteTextarea.style.height = 'auto';
		noteTextarea.style.height = `${noteTextarea.scrollHeight}px`;
		window.scrollTo(0, scrollPosition);
	}
</script>

<span bind:this={markerLetter} class="{$font} absolute left-[-9999px]">m</span>
<div class="notebook">
	<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
	<div class="w-full">
		<textarea
			bind:value={props.note}
			disabled={!editable}
			class="paper rounded-none overflow-y-hidden resize-none {$font} min-h-[490px]"
			id="note-textarea"
			bind:this={noteTextarea}
		/>
	</div>
</div>
