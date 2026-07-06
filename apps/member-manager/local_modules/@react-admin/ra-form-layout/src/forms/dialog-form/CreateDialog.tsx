import * as React from 'react';
import { ReactNode } from 'react';
import {
    useCreateController,
    useRedirect,
    CreateProps,
    CreateContextProvider,
    useResourceContext,
    useNotify,
    useEvent,
} from 'react-admin';
import { Dialog, DialogProps, SxProps } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { FormDialogTitle } from './FormDialogTitle';
import { useFormDialogContext } from './useFormDialogContext';
import { FormDialogContextType } from './FormDialogContext';

/**
 * A component which displays a creation form inside a dialog.
 *
 * By default, this components manages the open/close state of the dialog via the router.
 * In case it is used inside a `<FormDialogContext>`, or if the `isOpen`, `open` and `close`
 * props are provided directly, then the open/close state is managed by these values instead.
 *
 * @param {CreateDialogProps} props
 *
 * @example
 * const PostList = () => (
 *     <>
 *         <List>
 *             <Datagrid>
 *                 ...
 *             </Datagrid>
 *         </List>
 *         <CreateDialog>
 *             <SimpleForm>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </SimpleForm>
 *         </CreateDialog>
 *     </>
 * );
 *
 * @example with a managed state
 * const CustomerEditForm = () => {
 *     const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
 *     const openCreateDialog = useCallback(() => {
 *         setIsCreateDialogOpen(true);
 *     }, []);
 *     const closeCreateDialog = useCallback(() => {
 *         setIsCreateDialogOpen(false);
 *     }, []);
 *
 *     return (
 *         <SimpleForm>
 *             <Button
 *                 label="Create a new customer"
 *                 onClick={() => openCreateDialog()}
 *             />
 *             <CreateDialog
 *                 fullWidth
 *                 maxWidth="md"
 *                 isOpen={isCreateDialogOpen}
 *                 open={openCreateDialog}
 *                 close={closeCreateDialog}
 *                 resource="customers"
 *             >
 *                 <CustomerForm />
 *             </CreateDialog>
 *         </SimpleForm>
 *     );
 * };
 */
export const CreateDialog = ({ close, ...props }: CreateDialogProps) => {
    const resource = useResourceContext(props);
    const context = useFormDialogContext(props);
    const closeEvent = useEvent(context?.close ?? close);

    if (context) {
        return (
            <CreateDialogView
                resource={resource}
                {...context}
                {...props}
                close={closeEvent}
            />
        );
    }

    return (
        <Routes>
            <Route
                path="create/*"
                element={
                    <CreateDialogView
                        resource={resource}
                        isOpen
                        {...props}
                        close={close != null ? closeEvent : undefined}
                    />
                }
            />
        </Routes>
    );
};

const CreateDialogView = ({
    children,
    mutationOptions: mutationOptionsProp = {},
    title,
    redirect: redirectTo = 'list',
    ...props
}: CreateDialogViewProps) => {
    const redirect = useRedirect();
    const notify = useNotify();
    const { onSuccess, ...otherMutationOptions } = mutationOptionsProp;

    const queryClient = useQueryClient();
    const controllerProps = useCreateController({
        ...props,
        mutationOptions: {
            onSuccess: (data, variables, context) => {
                // Because redirecting to the list doesn't remount the List component, we need
                // to explicitly ask react-query to refresh the list queries
                queryClient.invalidateQueries([resource, 'getList']);
                queryClient.invalidateQueries([resource, 'getManyReference']);

                if (onSuccess) {
                    onSuccess(data, variables, context);

                    if (props.close) {
                        props.close();
                    }
                } else {
                    notify('ra.notification.created', {
                        type: 'info',
                        messageArgs: { smart_count: 1 },
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
    } as CreateProps);
    const { defaultTitle, record, resource } = controllerProps;

    const handleClose: FormDialogContextType['close'] = (
        event,
        reason
    ): void => {
        if (props.close) {
            props.close(event, reason);
        } else {
            redirect('list', props.resource, undefined, undefined, {
                _scrollToTop: false,
            });
        }
    };

    return (
        <Dialog
            open={props.isOpen}
            aria-labelledby="create-dialog-title"
            onClose={handleClose}
            data-testid="create-dialog"
            {...sanitizeRestProps(props)}
        >
            <FormDialogTitle
                id="create-dialog-title"
                title={title}
                defaultTitle={defaultTitle}
                record={record}
                onClose={handleClose}
            />
            <CreateContextProvider value={controllerProps}>
                {children}
            </CreateContextProvider>
        </Dialog>
    );
};

export interface CreateDialogProps
    extends Omit<CreateProps, 'classes'>,
        Omit<DialogProps, 'open' | 'id' | 'title'>,
        Partial<FormDialogContextType> {
    children?: ReactNode;
    sx?: SxProps;
}

interface CreateDialogViewProps extends CreateDialogProps {
    children?: ReactNode;
    isOpen?: boolean;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
    basePath = null,
    hasCreate = null,
    hasEdit = null,
    hasList = null,
    hasShow = null,
    history = null,
    loaded = null,
    loading = null,
    location = null,
    match = null,
    mutationOptions = null,
    options = null,
    permissions = null,
    transform = null,
    isOpen = null,
    open = null,
    close = null,
    ...rest
}): any => rest;
/* eslint-enable @typescript-eslint/no-unused-vars */
