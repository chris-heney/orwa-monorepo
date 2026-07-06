/// <reference types="react" />
/**
 * We need this context to communicate the callback to enable edit mode on a
 * row between the <EditableDatagridRow> and the <EditRowButton> and through
 * <DatagridRow> (which does not expect this prop).
 */
export declare const RowContext: import("react").Context<RowContextValue>;
export type RowContextValue = {
    open: () => void;
    close: () => void;
};
//# sourceMappingURL=RowContext.d.ts.map