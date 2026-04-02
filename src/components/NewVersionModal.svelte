<!--
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2024, 2026 Pokeghost.

PokeBook is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PokeBook is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
-->

<script lang="ts">
	import { latestChanges } from '$lib/constants/latestChanges';
	import { CURRENT_VERSION } from '$lib/constants/version';
</script>

<div class="modal-version">
	<h2>What's new in v{CURRENT_VERSION}</h2>
	<ul>
		{#each latestChanges as change, i (`changelogEntry-${i}`)}
			<li>{change}</li>
		{/each}
	</ul>
</div>
