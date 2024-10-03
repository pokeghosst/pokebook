import { createStore } from './storeFactory';

export const activeLanguage = await createStore('active_language', '');
