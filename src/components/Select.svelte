<script lang="ts">
	export let parameterName: string;
	export let labelName: string;
	export let bindParameter: string;
	export let options: { value: string; label: string }[] = [];
</script>

<div class="relative">
	<label for={parameterName}>{labelName}</label>
	<select
		bind:value={bindParameter}
		name={parameterName}
		class="block w-full pl-3 pr-10 py-2 rounded-md mb-4 mt-2"
	>
		{#each options as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
	<div class="dropdown-arrow pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-8">
		<svg
			class="h-6 w-6"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M7.293 8.293a1 1 0 011.414 0L10 9.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
</div>
