import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    EditContextProvider,
    EditProps,
    useEditController,
    useRedirect,
    useResourceContext,
    useNotify,
    useRecordContext,
    useEvent,
} from 'react-admin';
import { Dialog, DialogProps, SxProps } from '@mui/material';
import { FormDialogTitle } from './FormDialogTitle';
import { useLocation, Routes, Route, useParams } from 'react-router-dom';
import { useFormDialogContext } from './useFormDialogContext';
import { FormDialogContextType } from './FormDialogContext';

/**
 * A component which displays an edition form inside a dialog.
 *
 * By default, this components manages the open/close state of the dialog via the router.
 * In case it is used inside a `<FormDialogContext>`, or if the `isOpen`, `open` and `close`
 * props are provided directly, then the open/close state is managed by these values instead.
 *
 * @param {EditDialogProps} props
 *
 * @example
 * const PostList = () => (
 *     <>
 *         <List>
 *             <Datagrid>
 *                 ...
 *             </Datagrid>
 *         </List>
 *         <EditDialog>
 *             <SimpleForm>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </SimpleForm>
 *         </EditDialog>
 *     </>
 * );
 *
 * @example with a managed state
 * const CustomerEditForm = () => {
 *     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
 *     const openEditDialog = useCallback(() => {
 *         setIsEditDialogOpen(true);
 *     }, []);
 *     const closeEditDialog = useCallback(() => {
 *         setIsEditDialogOpen(false);
 *     }, []);
 *
 *     return (
 *         <SimpleForm>
 *             <Button
 *                 label="Edit customer #1"
 *                 onClick={() => openEditDialog()}
 *             />
 *             <EditDialog
 *                 fullWidth
 *                 maxWidth="md"
 *                 isOpen={isEditDialogOpen}
 *                 open={openEditDialog}
 *                 close={closeEditDialog}
 *                 resource="customers"
 *                 record={{ id: 1 }}
 *             >
 *                 <CustomerForm />
 *             </EditDialog>
 *         </SimpleForm>
 *     );
 * };
 */
export const EditDialog = ({ close, ...props }: EditDialogProps) => {
    const resource = useResourceContext(props);
    const context = useFormDialogContext(props);
    const record = useRecordContext(props);
    const closeEvent = useEvent(context?.close ?? close);

    if (context) {
        return (
            <EditDialogView
                resource={resource}
                id={record?.id}
                {...context}
                {...props}
                close={closeEvent}
            />
        );
    }
    return (
        <Routes>
            <Route
                path=":id/*"
                element={
                    <EditDialogView
                        resource={resource}
                        {...props}
                        close={close != null ? closeEvent : undefined}
                    />
                }
            />
        </Routes>
    );
};

const EditDialogView = (props: EditDialogViewProps) => {
    const redirect = useRedirect();
    const params = useParams<'id'>();
    const location = useLocation();

    const handleClose = (event, reason): void => {
        if (props.close) {
            props.close(event, reason);
        } else {
            redirect('list', props.resource, params.id, undefined, {
                _scrollToTop: false,
            });
        }
    };

    const isMatch =
        params.id &&
        params.id !== 'create' &&
        location.pathname.indexOf('/show') === -1;

    const open = props.isOpen ?? isMatch;

    return (
        <Dialog
            open={open}
            aria-labelledby="edit-dialog-title"
            onClose={handleClose}
            data-testid="edit-dialog"
            {...sanitizeRestProps(props)}
        >
            {open ? (
                <EditDialogContentView {...props} onClose={handleClose} />
            ) : null}
        </Dialog>
    );
};

export interface EditDialogProps
    extends Omit<EditProps, 'classes'>,
        Omit<DialogProps, 'open' | 'id' | 'title'>,
        Partial<FormDialogContextType> {
    children?: ReactNode;
    sx?: SxProps;
}

const EditDialogContentView = ({
    children,
    onClose,
    title,
    redirect: redirectTo = 'list',
    ...props
}: EditDialogViewProps & {
    onClose: FormDialogContextType['close'];
}) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { mutationMode = 'undoable', mutationOptions = {} } = props;
    const { onSuccess, ...otherMutationOptions } = mutationOptions;

    const controllerProps = useEditController({
        ...props,
        mutationOptions: {
            onSuccess: (data, variables, context) => {
                if (onSuccess) {
                    onSuccess(data, variables, context);

                    if (props.close) {
                        props.close();
                    }
                } else {
                    notify('ra.notification.updated', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
                        undoable: mutationMode === 'undoable',
                    });

                    if (props.close) {
                        props.close();
                    } else {
                        redirect(redirectTo, props.resource, data.id, data, {
                            _scrollToTop: false,
                        });
                    }
                }
            },
            ...otherMutationOptions,
        },
    } as EditProps);
    const { defaultTitle, record } = controllerProps;

    return (
        <>
            <EditContextProvider value={controllerProps}>
                <FormDialogTitle
                    id="edit-dialog-title"
                    title={title}
                    defaultTitle={defaultTitle}
                    onClose={onClose}
                    record={record}
                />
                {record && children}
            </EditContextProvider>
        </>
    );
};

interface EditDialogViewProps extends EditDialogProps {
    children?: ReactNode;
    isOpen?: boolean;
    title?: ReactElement | string;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    basePath = null,
    hasCreate = null,
    hasEdit = null,
    hasShow = null,
    hasList = null,
    history = null,
    id = null,
    loaded = null,
    loading = null,
    location = null,
    match = null,
    mutationOptions = null,
    mutationMode = null,
    options = null,
    permissions = null,
    successMessage = null,
    title = null,
    transform = null,
    isOpen = null,
    open = null,
    close = null,
    ...rest
}): any => rest;

/* eslint-enable @typescript-eslint/no-unused-vars */
