import { createStore } from './storeFactory';

export const themeMode = await createStore('theme_mode', 'auto');
