import type { JSX } from "solid-js";

export const createInputHandler = (
  handleValue: (value: string) => void
): JSX.EventHandler<HTMLTextAreaElement | HTMLInputElement, InputEvent> => {
  return (event) => {
    handleValue(event.currentTarget.value);
  };
};
