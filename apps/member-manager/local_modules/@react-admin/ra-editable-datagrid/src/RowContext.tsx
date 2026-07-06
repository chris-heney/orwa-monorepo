import { createContext } from 'react';

/**
 * We need this context to communicate the callback to enable edit mode on a
 * row between the <EditableDatagridRow> and the <EditRowButton> and through
 * <DatagridRow> (which does not expect this prop).
 */
export const RowContext = createContext<RowContextValue>(null);

export type RowContextValue = {
    open: () => void;
    close: () => void;
};
