import {
  Accessor,
  createEffect,
  createSignal,
  onMount,
  Setter,
} from "solid-js";

import { Preferences } from "../lib/Preferences";

export function createStoredSignal(
  key: string,
  initialValue: string
): [Accessor<string>, Setter<string>] {
  const [value, setValue] = createSignal("");

  onMount(async () => {
    setValue((await Preferences.get({ key })).value ?? initialValue);
  });

  createEffect(() => {
    Preferences.set({ key, value: value() });
  });

  return [value, setValue];
}
