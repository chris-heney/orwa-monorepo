import * as React from 'react';
import { ReactNode } from 'react';
import { EditRowButton, DeleteRowButton } from './buttons';

export const ActionsColumn = ({
    mutationMode,
    children,
    noDelete,
    label,
    ...props
}: ActionsColumnProp) => (
    <>
        {/* In order to allow users to customize the actions without losing the create button being set,
         *  the EditableDatagrid always renders an ActionsColumn.
         *  This is because we add the create button as the label of this column.
         */}
        {children != null ? (
            children
        ) : (
            <>
                <EditRowButton />
                {!noDelete && (
                    <DeleteRowButton mutationMode={mutationMode} {...props} />
                )}
            </>
        )}
    </>
);

export interface ActionsColumnProp {
    children?: ReactNode;
    noDelete?: boolean;
    redirect: string | boolean;
    [key: string]: any;
}
