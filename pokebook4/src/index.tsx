import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { render } from "solid-js/web";

import App from "./App";

import "./sass/main.scss";

const Draft = lazy(() => import("./routes/Draft"));

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Draft} />
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
