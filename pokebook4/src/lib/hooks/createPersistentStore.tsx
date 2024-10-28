import { onMount } from "solid-js";
import { createStore } from "solid-js/store";

import { Preferences } from "../Preferences";

export function createPersistentStore<T extends Record<string, string>>(
  initialState: T
): [T, (key: keyof T, newValue: string) => void] {
  const [store, setStore] = createStore<T>(initialState);

  const setPersistentStore = (key: keyof T, newValue: string) => {
    setStore(key as any, newValue as any);

    Preferences.set({
      key: String(key),
      value: newValue,
    });
  };

  onMount(async () => {
    const keys = Object.keys(initialState) as Array<keyof T>;

    const promises = keys.map(async (key) => {
      const { value } = await Preferences.get({ key: String(key) });
      return { key, value: value ? value : initialState[key] };
    });

    const results = await Promise.all(promises);

    const storedValues = results.reduce((acc, { key, value }) => {
      acc[key] = value as T[typeof key];
      return acc;
    }, {} as T);

    setStore(storedValues);
  });

  return [store, setPersistentStore];
}
