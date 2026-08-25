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

import { describe, expect, it, vi } from 'vitest';
import formatTimeAgo from './formatTimeAgo';

const date = new Date('December 31, 2026 12:00:00');

vi.setSystemTime(date);

describe('formatTimeAgo', () => {
	const now = Date.now();

	describe('minutes', () => {
		it('less than a minute', () => {
			expect(formatTimeAgo(now - 59 * 1000, 'en')).toEqual('Just now');
		});
		it('exactly a minute', () => {
			expect(formatTimeAgo(now - 60 * 1000, 'en')).toEqual('1 minute ago');
		});
		it('more than a minute', () => {
			expect(formatTimeAgo(now - 119 * 1000, 'en')).toEqual('1 minute ago');
		});
		it('two minutes', () => {
			expect(formatTimeAgo(now - 120 * 1000, 'en')).toEqual('2 minutes ago');
		});
	});

	describe('hours', () => {
		it('less than an hour', () => {
			expect(formatTimeAgo(now - 59 * 60 * 1000, 'en')).toEqual('59 minutes ago');
		});
		it('exactly an hour', () => {
			expect(formatTimeAgo(now - 60 * 60 * 1000, 'en')).toEqual('1 hour ago');
		});
		it('more than an hour', () => {
			expect(formatTimeAgo(now - 119 * 60 * 1000, 'en')).toEqual('1 hour ago');
		});
		it('two hours', () => {
			expect(formatTimeAgo(now - 120 * 60 * 1000, 'en')).toEqual('2 hours ago');
		});
	});

	describe('days', () => {
		it('less than a day', () => {
			expect(formatTimeAgo(now - 23 * 60 * 60 * 1000, 'en')).toEqual('23 hours ago');
		});
		it('exactly a day', () => {
			expect(formatTimeAgo(now - 24 * 60 * 60 * 1000, 'en')).toEqual('yesterday');
		});
		it('more than a day', () => {
			expect(formatTimeAgo(now - 30 * 24 * 60 * 60 * 1000, 'en')).toEqual('30 days ago');
		});
	});

	describe('months', () => {
		it('thirty-one day', () => {
			expect(formatTimeAgo(now - 31 * 24 * 60 * 60 * 1000, 'en')).toEqual('Nov 30');
		});
		it('three hundred sixty four days', () => {
			expect(formatTimeAgo(now - 364 * 24 * 60 * 60 * 1000, 'en')).toEqual('Jan 1');
		});
	});

	describe('years', () => {
		it('three hundred sixty five days', () => {
			expect(formatTimeAgo(now - 365 * 24 * 60 * 60 * 1000, 'en')).toEqual('Dec 31, 2025');
		});
		it('two years', () => {
			expect(formatTimeAgo(now - 2 * 365 * 24 * 60 * 60 * 1000, 'en')).toEqual('Dec 31, 2024');
		});
	});
});
