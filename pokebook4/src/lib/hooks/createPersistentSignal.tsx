import {
  Accessor,
  createEffect,
  createSignal,
  onMount,
  Setter,
} from "solid-js";

import { Preferences } from "../Preferences";

export function createPersistentSignal(
  key: string,
  initialValue: string
): [Accessor<string>, Setter<string>] {
  const [value, setValue] = createSignal("");

  onMount(async () => {
    setValue((await Preferences.get({ key })).value ?? initialValue);
  });

  // Consider changing to a custom Setter
  createEffect(() => {
    Preferences.set({ key, value: value() });
  });

  return [value, setValue];
}
