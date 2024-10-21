import { Preferences } from 'lib/plugins/Preferences';
import { onMount } from 'svelte';

export function usePreferences(key: string, initialValue: string) {
	let value: string = $state<string>(initialValue);

	onMount(async () => {
		const currentValue = (await Preferences.get({ key })).value;
		if (currentValue) value = currentValue;
	});

	return {
		set value(newValue: string) {
			// console.log('updating value');
			value = newValue;
			Preferences.set({ key, value });
		},
		get value() {
			// console.log('getting value', value);
			return value;
		}
	};
}
