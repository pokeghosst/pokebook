import { PreferencesProvider } from "@components/PreferencesProvider";
import { ParentComponent } from "solid-js";

const App: ParentComponent = (props) => (
  <PreferencesProvider>{props.children}</PreferencesProvider>
);
export default App;
