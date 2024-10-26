import type { JSX } from "solid-js";

export type NotepadProps = {
  text: string;
  inputHandler: JSX.EventHandler<HTMLTextAreaElement, InputEvent>;
};

export type PoemPadProps = {
  title: string;
  titleInputHandler: JSX.EventHandler<HTMLInputElement, InputEvent>;
} & NotepadProps;
