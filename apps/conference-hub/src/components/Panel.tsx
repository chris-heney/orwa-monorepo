import type { PropsWithChildren, ReactNode } from "react";
import { cx, ui } from "../ui/tokens";

type PanelProps = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
  bodyClassName?: string;
  scroll?: boolean;
}>;

export default function Panel({
  title,
  children,
  className,
  bodyClassName,
  scroll = false,
}: PanelProps) {
  return (
    <section className={cx(ui.panel, className)}>
      {title != null && <div className={ui.titleBar}>{title}</div>}
      <div
        className={cx(
          ui.panelBody,
          scroll && ui.panelScroll,
          bodyClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
