import type { LucideProps } from "lucide-solid";
import type { JSX } from "solid-js";

export type ToolbarItem = {
  icon: (props: LucideProps) => JSX.Element;
  action: () => void;
  label: string;
};
