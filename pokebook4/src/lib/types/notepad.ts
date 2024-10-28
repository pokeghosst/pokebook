import type { JSX } from "solid-js";

export type PaperProps = {
  text: string;
  inputHandler: JSX.EventHandler<HTMLTextAreaElement, InputEvent>;
};

export type PoemNotepadProps = {
  title: string;
  titleInputHandler: JSX.EventHandler<HTMLInputElement, InputEvent>;
} & PaperProps;
