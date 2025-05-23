/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2025 Pokeghost.

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
*/

import { browser } from '$app/environment';

import { getPoem } from '$lib/services/poems.service';

import { DRAFT_POEM_ID } from '$lib/util/constants';

import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	if (browser) {
		const draft = await getPoem(DRAFT_POEM_ID);

		return draft
			? draft
			: {
					name: '',
					text: '',
					note: ''
				};
	}

	// TODO: Come up with proper name
	throw new Error('Not implemented');
};
