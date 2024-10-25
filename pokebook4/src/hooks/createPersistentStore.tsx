import { onMount, createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";

import { Preferences } from "../lib/Preferences";

export function createPersistentStore(keys: string[], defaults: string[] = []) {
  const [store, setStore] = createStore<Record<string, string>>({});

  onMount(async () => {
    keys.forEach(async (key, i) => {
      const { value } = await Preferences.get({ key });

      setStore(key, value || defaults[i]);

      console.log("current store state", store);
      console.log("value from preferences", value);
      console.log("defaults value", defaults[i]);
      console.log("nullish value", value || defaults[i]);

      createEffect(
        on(
          () => store[key],
          (value) => {
            if (typeof value === "string") {
              Preferences.set({ key, value });
            } else {
              Preferences.remove({ key });
            }
          }
        )
      );
    });
  });

  return [store, setStore];
}
