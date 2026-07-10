export type ThemeMode = 'day' | 'night' | 'auto';

export const themeModes: { value: ThemeMode; label: string }[] = [
	{ value: 'day', label: 'themes.day' },
	{ value: 'night', label: 'themes.night' },
	{ value: 'auto', label: 'themes.auto' }
];
