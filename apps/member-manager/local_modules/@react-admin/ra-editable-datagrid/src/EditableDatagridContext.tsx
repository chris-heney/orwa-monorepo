import { createContext } from 'react';

export interface EditableDatagridContextValue {
    openStandaloneCreateForm: () => void;
    closeStandaloneCreateForm: () => void;
}

export const EditableDatagridContext =
    createContext<EditableDatagridContextValue>(undefined);

export const EditableDatagridContextProvider = EditableDatagridContext.Provider;
