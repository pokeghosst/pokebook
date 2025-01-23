import { Preferences } from '$lib/plugins/Preferences';
import { onMount } from 'svelte';

export type PreferencesStore<T> = { remove: () => void; value: T };

export function usePreferences<T>(key: string, initialValue: T): PreferencesStore<T> {
	let value: T = $state<T>(initialValue);

	onMount(async () => {
		const currentValue = (await Preferences.get({ key })).value;
		if (currentValue) value = JSON.parse(currentValue);
	});

	return {
		remove() {
			value = initialValue;
			Preferences.remove({ key });
		},
		set value(newValue: T) {
			// console.log('updating value');
			value = newValue;
			Preferences.set({ key, value: JSON.stringify(value) });
		},
		get value() {
			// console.log('getting value', value);
			return value;
		}
	};
}
