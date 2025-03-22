import { StorageProvider } from '$lib/enums/StorageProvider';

export const storageOptions = (() => {
	const storageOptions: { value: string; label: string }[] = [];
	Object.values(StorageProvider).forEach((key) => {
		storageOptions.push({ value: key, label: `settings.${key}` });
	});
	return storageOptions;
})();
