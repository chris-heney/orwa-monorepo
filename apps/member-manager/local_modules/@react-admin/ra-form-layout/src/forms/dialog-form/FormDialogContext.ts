import { createContext } from 'react';

export type FormDialogContextType = {
    isOpen: boolean;
    open: () => void;
    // Disabled as this is how it's done in MUI
    // eslint-disable-next-line @typescript-eslint/ban-types
    close: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
};

/**
 * A context holding open/close state and callbacks for managing a child form dialog.
 *
 * @param value.open The open/close state. `true` if the dialog is open.
 * @param value.open The callback that gets called to open the dialog.
 * @param value.close The callback that gets called to close the dialog.
 */
export const FormDialogContext = createContext<FormDialogContextType>(null);
