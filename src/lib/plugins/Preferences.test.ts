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

import fc from 'fast-check';
import { beforeEach, describe, expect, it } from 'vitest';
import { Preferences } from './Preferences';

describe('preferences', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should set and get from storage', async () => {
		await Preferences.set({ key: 'foo', value: 'bar' });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBe('bar');
	});
	it('should override value for same key', async () => {
		await Preferences.set({ key: 'foo', value: 'bar' });
		await Preferences.set({ key: 'foo', value: 'baz' });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBe('baz');
	});
	it('should set and get empty value', async () => {
		await Preferences.set({ key: 'foo', value: '' });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBe('');
	});
	it('should handle unicode', async () => {
		const pairs = [
			{ key: 'foo', value: '世界' },
			{ key: 'bar', value: '🌍' },
			{ key: 'baz', value: 'émoji' }
		];

		for (const { key, value } of pairs) {
			await Preferences.set({ key, value });

			const { value: actual } = await Preferences.get({ key });
			expect(actual).toBe(value);
		}
	});
	it('should return null after removing key', async () => {
		await Preferences.set({ key: 'foo', value: 'bar' });
		await Preferences.remove({ key: 'foo' });

		const { value } = await Preferences.get({ key: 'foo' });

		expect(value).toBeNull();
	});
	it('should return null for non-existing key', async () => {
		const { value } = await Preferences.get({ key: 'foo' });
		expect(value).toBeNull();
	});
	it('should not throw when removing a key that does not exist', async () => {
		await expect(Preferences.remove({ key: 'foo' })).resolves.not.toThrow();
	});
	it('should return null for all keys after clear', async () => {
		const dummies = [
			{ key: 'foo', value: 'bar' },
			{ key: 'baz', value: 'xyf' }
		];

		for (const { key, value } of dummies) {
			await Preferences.set({ key, value });
		}

		await Preferences.clear();

		for (const { key } of dummies) {
			const { value: v } = await Preferences.get({ key });
			expect(v).toBeNull();
		}
	});
	it('should not throw when clearing an empty store', async () => {
		await expect(Preferences.clear()).resolves.not.toThrow();
	});
	it('should set and get arbitrary values correctly', async () => {
		await fc.assert(
			fc.asyncProperty(fc.string(), fc.string(), async (key, value) => {
				localStorage.clear();

				await Preferences.set({ key, value });
				const { value: actual } = await Preferences.get({ key });

				expect(actual).toBe(value);
			})
		);
	});
});
