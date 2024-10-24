import {
  Component,
  createResource,
  createSignal,
  JSX,
  onMount,
} from "solid-js";

import { Preferences } from "../lib/Preferences";

import pad from "./pad.module.css";

const WritingPad: Component = () => {
  const [content, { mutate }] = createResource(
    async () => (await Preferences.get({ key: "draft_poem" })).value || ""
  );

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (
    event
  ) => {};

  return (
    <div>
      <p>writing pad</p>
      <textarea
        class={pad.paper}
        onInput={handleInput}
        value={content()}
      ></textarea>
    </div>
  );
};

export default WritingPad;
