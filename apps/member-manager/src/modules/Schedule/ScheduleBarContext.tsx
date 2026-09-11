import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type ScheduleDialog = "duplicate" | "clear" | null;

/** What the Schedule panel lets the title bar trigger. */
export interface ScheduleCommands {
  downloadPdf: () => void;
  exportCsv: () => void;
}

export interface ScheduleBarState {
  printView: boolean;
  setPrintView: Dispatch<SetStateAction<boolean>>;
  dialog: ScheduleDialog;
  setDialog: Dispatch<SetStateAction<ScheduleDialog>>;
  /** Items currently loaded by the panel (Export is disabled at 0). */
  recordCount: number;
  setRecordCount: Dispatch<SetStateAction<number>>;
  /** Null until the Schedule panel has mounted. */
  commands: ScheduleCommands | null;
  registerCommands: Dispatch<SetStateAction<ScheduleCommands | null>>;
}

const ScheduleBarContext = createContext<ScheduleBarState | null>(null);

/**
 * Shared state between the Schedule tab's title-bar actions and its panel.
 *
 * Framework actions render in the page's title bar, OUTSIDE the tab panel, so
 * they cannot read the panel's `ScheduleProvider`. Following the Conference
 * module's existing pattern (`creatingTab` for the inline Add action), the
 * state they share lives in the page provider: print view, which dialog is
 * open, and the commands the panel registers (PDF capture needs the panel's
 * DOM ref; the CSV uses the records the panel loaded).
 */
export const ScheduleBarProvider = ({ children }: PropsWithChildren) => {
  const [printView, setPrintView] = useState(false);
  const [dialog, setDialog] = useState<ScheduleDialog>(null);
  const [recordCount, setRecordCount] = useState(0);
  const [commands, registerCommands] = useState<ScheduleCommands | null>(null);

  const value = useMemo<ScheduleBarState>(
    () => ({
      printView,
      setPrintView,
      dialog,
      setDialog,
      recordCount,
      setRecordCount,
      commands,
      registerCommands,
    }),
    [printView, dialog, recordCount, commands]
  );

  return <ScheduleBarContext.Provider value={value}>{children}</ScheduleBarContext.Provider>;
};

/** The shared state, or null outside a `ScheduleBarProvider` (the panel then keeps its own). */
export const useScheduleBar = (): ScheduleBarState | null => useContext(ScheduleBarContext);

export default ScheduleBarProvider;
