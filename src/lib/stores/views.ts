import { createStore } from './storeFactory';

export const viewsState = createStore('writing_pads_state', JSON.stringify([0, 1]));
