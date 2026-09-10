import React, { ComponentType, Suspense } from "react";
import { LinearProgress } from "@mui/material";
import type { LazyPanel } from "../../../framework/manifest";
import { lazyPanel } from "../../../framework/lazyPanel";
import ConferenceListSync from "./ConferenceListSync";

/**
 * `panel: conferencePanel(() => import('./X'))` — a framework `lazyPanel`
 * wrapped in `ConferenceListSync`, so every Conference Manager tab keeps its
 * filter values scoped to the selected conference / year without each panel
 * file having to know about it.
 */
export const conferencePanel = <T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
): LazyPanel => {
  const inner = lazyPanel(loader);
  const Inner = inner.component;
  const Wrapped: ComponentType = () => (
    <ConferenceListSync>
      <Suspense fallback={<LinearProgress sx={{ m: 0 }} />}>
        <Inner />
      </Suspense>
    </ConferenceListSync>
  );
  Wrapped.displayName = "ConferencePanel";
  return {
    component: React.lazy(() => Promise.resolve({ default: Wrapped })),
    preload: inner.preload,
  };
};

export default conferencePanel;
