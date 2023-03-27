<script>
	import { font } from "../stores/font";
	import { dayTheme } from "../stores/mode";

	export let props;
	export let editable;
</script>

<div class="notebook h-screen">
	<div class="top text-white leading-[50px] pl-5 font-bold">Notes</div>
	<div class="w-full">
		<textarea bind:value={props.note} disabled={!editable} class="paper h-screen rounded-none {$font}" />
	</div>
</div>
