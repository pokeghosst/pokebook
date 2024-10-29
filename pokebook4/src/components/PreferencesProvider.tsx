import { createPersistentStore } from "@lib/hooks/createPersistentStore";
import { createContext, useContext, type ParentComponent } from "solid-js";

const preferencesInit = {
  isFullWidthPad: "false",
  writingPadState: "[1,0]",
};

type PreferencesType = typeof preferencesInit;

type PreferencesContextType<T extends Record<string, string>> = [
  preferences: T,
  setPreference: (key: keyof T, value: string) => void
];

export const PreferencesContext =
  createContext<PreferencesContextType<PreferencesType>>();

export const PreferencesProvider: ParentComponent = (props) => {
  const [preferences, setPreferences] = createPersistentStore(preferencesInit);

  return (
    <PreferencesContext.Provider value={[preferences, setPreferences]}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
};
