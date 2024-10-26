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

    const promises = keys.map((key) =>
      Preferences.get({ key: String(key) }).then(({ value }) => ({
        key,
        value,
      }))
    );

    const results = await Promise.all(promises);

    const storedValues = results.reduce((acc, { key, value }) => {
      if (value !== null) {
        acc[key] = value as T[typeof key];
      }
      return acc;
    }, {} as Partial<T>);

    setStore(storedValues as T);
  });

  return [store, setPersistentStore];
}
