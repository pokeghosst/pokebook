/*
PokeBook -- Pokeghost's poetry noteBook
Copyright (C) 2026 Pokeghost.

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

import { describe, expect, it } from 'vitest';
import { Preferences } from './Preferences';

describe('preferences', () => {
	it('sets to and gets from local storage', async () => {
		const expected = 'bar';
		await Preferences.set({ key: 'foo', value: expected });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBe(expected);
	});
	it('removes from local storage', async () => {
		await Preferences.set({ key: 'foo', value: 'bar' });
		await Preferences.remove({ key: 'foo' });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBe(null);
	});
	it('clears local storage', async () => {
		const dummies = [
			{ key: 'foo', value: 'bar' },
			{ key: 'baz', value: 'var' }
		];

		for (const { key, value } of dummies) {
			await Preferences.set({ key, value });
		}

		await Preferences.clear();

		for (const { key } of dummies) {
			const { value: v } = await Preferences.get({ key });
			expect(v).toBe(null);
		}
	});
});
