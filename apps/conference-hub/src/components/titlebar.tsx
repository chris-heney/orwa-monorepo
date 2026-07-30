import type { PropsWithChildren } from "react";
import { ui } from "../ui/tokens";

export default function TitleBar({ children }: PropsWithChildren) {
  return <div className={ui.titleBar}>{children}</div>;
}
