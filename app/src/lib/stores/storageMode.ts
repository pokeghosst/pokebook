import { createStore } from './storeFactory';

export const storageMode = await createStore('storage_mode', 'local');
