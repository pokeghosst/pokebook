import { createStore } from './storeFactory';

export const isSidebarOpen = await createStore('sidebar_open', 'false');
