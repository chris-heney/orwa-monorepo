import * as React from 'react';
import { useCallback, ReactElement, ReactNode, useMemo } from 'react';

import PropTypes from 'prop-types';
import {
    CreateParams,
    CreateBase,
    ExpandRowButton,
    RaRecord,
    useNotify,
    useRefresh,
    useResourceContext,
    TransformData,
} from 'react-admin';
import { UseMutationOptions } from 'react-query';
import { useMatch } from 'react-router-dom';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { RowContext } from './RowContext';

const EditableDatagridCreateForm = (props: EditableDatagridCreateFormProps) => {
    const {
        expand,
        hasBulkActions,
        createForm,
        hasStandaloneCreateForm,
        isStandaloneCreateFormVisible,
        closeStandaloneCreateForm,
        mutationOptions = {},
        transform,
    } = props;

    const notify = useNotify();
    const refresh = useRefresh();
    const resource = useResourceContext(props);
    const match = useMatch(`/${resource}/create/*`);

    const defaultOnSuccess = useCallback(() => {
        notify('ra.notification.created', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
        closeStandaloneCreateForm();
    }, [closeStandaloneCreateForm, notify, refresh]);

    const defaultOnError = useCallback(
        error => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                { type: 'warning' }
            );
        },
        [notify]
    );

    const createContext = useMemo(
        () => ({
            open: () => {
                /* */
            },
            close: closeStandaloneCreateForm,
        }),
        [closeStandaloneCreateForm]
    );

    const createFormElement = (
        <RowContext.Provider value={createContext}>
            <CreateBase
                mutationOptions={{
                    onSuccess: defaultOnSuccess,
                    onError: defaultOnError,
                    ...mutationOptions,
                }}
                transform={transform}
                resource={resource}
            >
                <TableRow key="create-record">
                    {expand && (
                        <TableCell padding="none">
                            <ExpandRowButton expanded={false} disabled />
                        </TableCell>
                    )}
                    {hasBulkActions && (
                        <TableCell padding="checkbox">
                            <Checkbox color="primary" disabled />
                        </TableCell>
                    )}
                    {createForm}
                </TableRow>
            </CreateBase>
        </RowContext.Provider>
    );

    if (hasStandaloneCreateForm) {
        // create form triggered by state
        return isStandaloneCreateFormVisible && createFormElement;
    } else {
        // create form in a route
        return !!match ? createFormElement : null;
    }
};

export interface EditableDatagridCreateFormProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> {
    expand?: ReactNode;
    hasBulkActions?: boolean;
    resource?: string;
    createForm?: ReactElement;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        CreateParams<RecordType>
    >;
    transform?: TransformData;
}

EditableDatagridCreateForm.propTypes = {
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    resource: PropTypes.string,
    createForm: PropTypes.element,
    hasStandaloneCreateForm: PropTypes.bool,
    isStandaloneCreateFormVisible: PropTypes.bool.isRequired,
    closeStandaloneCreateForm: PropTypes.func.isRequired,
};

export default EditableDatagridCreateForm;
