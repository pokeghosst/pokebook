import { createStore } from './storeFactory';

export const viewsState = await createStore('writing_pads_state', JSON.stringify([0, 1]));
