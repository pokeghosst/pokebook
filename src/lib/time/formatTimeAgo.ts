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

type RelativeTimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function getRelativeTimeFormat(locale: string) {
	let rtf = rtfCache.get(locale);

	if (!rtf) {
		rtf = new Intl.RelativeTimeFormat(locale, {
			localeMatcher: 'best fit',
			numeric: 'auto',
			style: 'long'
		});

		rtfCache.set(locale, rtf);
	}

	return rtf;
}

export default function formatTimeAgo(timestamp: number, locale: string) {
	const now = Date.now();
	const elapsed = now - timestamp;

	const units: Record<RelativeTimeUnit, number> = {
		year: 24 * 60 * 60 * 1000 * 365,
		month: (24 * 60 * 60 * 1000 * 365) / 12,
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
		second: 1000
	};

	if (elapsed < units.minute) {
		return 'Just now';
	} else if (elapsed < units.month) {
		for (const [unit, value] of Object.entries(units) as [keyof typeof units, number][]) {
			if (elapsed >= value) {
				return getRelativeTimeFormat(locale).format(-Math.floor(elapsed / value), unit);
			}
		}

		/*
		 * This avoids function return type being inferred as 'string' | 'undefined'
		 * since TypeScript doesn't know that conditional in the loop above will
		 * always return something
		 */
		return getRelativeTimeFormat(locale).format(-Math.floor(elapsed / units.second), 'second');
	} else if (elapsed < units.year) {
		return new Date(timestamp).toLocaleDateString(locale, {
			month: 'short',
			day: 'numeric'
		});
	} else {
		return new Date(timestamp).toLocaleDateString(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
}
