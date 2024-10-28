import { createPersistentStore } from "@lib/hooks/createPersistentStore";
import { createContext, useContext, type ParentComponent } from "solid-js";

type PreferencesContextType = [
  preferences: Record<string, string>,
  setPreference: (key: string, value: string) => void
];

export const PreferencesContext = createContext<PreferencesContextType>();

const preferencesInit = {
  isPoemPadExpanded: "false",
};

export const PreferencesProvider: ParentComponent = (props) => {
  const [preferences, setPreferences] = createPersistentStore(preferencesInit);

  return (
    <PreferencesContext.Provider value={[preferences, setPreferences]}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () =>
  useContext(PreferencesContext) as PreferencesContextType;
