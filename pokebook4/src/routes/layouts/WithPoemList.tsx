import { PoemListProvider } from "../../contexts/PoemListProvider";

import type { ParentComponent } from "solid-js";

const WithPoemList: ParentComponent = (props) => {
  return <PoemListProvider>{props.children}</PoemListProvider>;
};

export default WithPoemList;
