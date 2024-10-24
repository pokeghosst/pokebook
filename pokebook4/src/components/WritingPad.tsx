import { Component, JSX } from "solid-js";

import { createStoredSignal } from "../hooks/createStoredSignal";
import pad from "./pad.module.css";

const WritingPad: Component = () => {
  const [content, setContent] = createStoredSignal("current_poem", "");

  const handleInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent> = (
    event
  ) => {
    setContent(event.currentTarget.value);
  };

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
