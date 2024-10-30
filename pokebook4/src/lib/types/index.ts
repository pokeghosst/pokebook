export type {
  PaperProps as NotepadProps,
  PoemNotepadProps as PoemPadProps,
} from "./notepad";
export type { ToolbarItem } from "./components";
export type * from "./models";

declare global {
  interface Window {
    __TAURI_INTERNALS__: Record<string, unknown>;
  }
}
