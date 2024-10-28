import { createPersistentStore } from "@lib/hooks/createPersistentStore";

const initPreferences = {
  isFullWidthPad: "false",
};

export const userPreferences = createPersistentStore(initPreferences);
