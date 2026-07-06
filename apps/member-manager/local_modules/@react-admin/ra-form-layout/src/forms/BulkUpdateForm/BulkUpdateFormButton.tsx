import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import {
    Dialog,
    DialogProps,
    DialogTitle,
    IconButton,
    alpha,
    styled,
} from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import {
    BulkUpdateButtonProps,
    Button,
    RaRecord,
    SaveContextProvider,
    SaveContextValue,
    SaveHandler,
    UpdateManyParams,
    UseUpdateManyResult,
    useGetResourceLabel,
    useListContext,
    useMutationMiddlewares,
    useNotify,
    useRefresh,
    useResourceContext,
    useTranslate,
    useUnselectAll,
    useUpdateMany,
} from 'react-admin';
import { UseMutationOptions } from 'react-query';

/**
 * This component renders a button allowing to edit multiple records at once.
 *
 * The `<BulkUpdateFormButton>` can be used inside `<Datagrid>`'s `bulkActionButtons`.
 * It will render a button that opens a dialog containing the form passed as children.
 * When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.
 *
 * @example
 * ```tsx
 * import * as React from 'react';
 * import {
 *     Admin,
 *     BooleanField,
 *     BooleanInput,
 *     Datagrid,
 *     DateField,
 *     DateInput,
 *     List,
 *     Resource,
 *     SimpleForm,
 *     TextField,
 * } from 'react-admin';
 * import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
 *
 * import { dataProvider } from './dataProvider';
 * import { i18nProvider } from './i18nProvider';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * const PostBulkUpdateButton = () => (
 *     <BulkUpdateFormButton>
 *         <SimpleForm>
 *             <DateInput source="published_at" />
 *             <BooleanInput source="is_public" />
 *         </SimpleForm>
 *     </BulkUpdateFormButton>
 * );
 *
 * const PostList = () => (
 *     <List>
 *         <Datagrid bulkActionButtons={<PostBulkUpdateButton />}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <DateField source="published_at" />
 *             <BooleanField source="is_public" />
 *         </Datagrid>
 *     </List>
 * );
 * ```
 */
export const BulkUpdateFormButton = (props: BulkUpdateFormButtonProps) => {
    const resource = useResourceContext(props);
    const { selectedIds } = useListContext(props);
    const unselectAll = useUnselectAll(resource);
    const refresh = useRefresh();
    const notify = useNotify();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const dialogTitle = translate('ra-form-layout.action.bulk_update', {
        resource: getResourceLabel(resource, selectedIds?.length ?? 2),
        _: 'Update selected %{resource}',
        smart_count: selectedIds?.length ?? 2,
    });

    const {
        children,
        className,
        DialogProps = {},
        label = 'ra.action.update',
        icon = defaultIcon,
        mutationMode,
        onSuccess = () => {
            notify('ra.notification.updated', {
                type: 'info',
                messageArgs: { smart_count: selectedIds.length },
                undoable: mutationMode === 'undoable',
            });
            unselectAll();
            refresh();
        },
        onError = (error: Error | string) => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                {
                    type: 'error',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
            refresh();
        },
        mutationOptions = {},
        ...rest
    } = props;

    const { meta, ...otherMutationOptions } = mutationOptions;

    const {
        registerMutationMiddleware,
        unregisterMutationMiddleware,
        getMutateWithMiddlewares,
    } = useMutationMiddlewares<UseUpdateManyResult[0]>();

    const [updateMany, { isLoading }] = useUpdateMany();
    const mutate = getMutateWithMiddlewares(updateMany);

    const save = useCallback<SaveHandler<any>>(
        async data => {
            await mutate(
                resource,
                { ids: selectedIds, data, meta },
                {
                    onError,
                    mutationMode,
                    ...otherMutationOptions,
                    onSuccess: (data, variables: any, context) => {
                        otherMutationOptions.onSuccess
                            ? otherMutationOptions.onSuccess(
                                  data,
                                  variables,
                                  context
                              )
                            : onSuccess();
                        handleClose();
                    },
                }
            );
        },
        [
            meta,
            mutate,
            mutationMode,
            onError,
            onSuccess,
            otherMutationOptions,
            resource,
            selectedIds,
        ]
    );

    const saveContext = useMemo<SaveContextValue>(
        () => ({
            save,
            registerMutationMiddleware,
            unregisterMutationMiddleware,
            saving: isLoading,
            mutationMode,
        }),
        [
            save,
            registerMutationMiddleware,
            unregisterMutationMiddleware,
            isLoading,
            mutationMode,
        ]
    );

    return (
        <>
            <StyledButton
                onClick={handleClickOpen}
                label={label}
                disabled={isLoading}
                className={clsx(className, BulkUpdateFormButtonClasses.root)}
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </StyledButton>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': { minWidth: { md: '50%' } },
                }}
                {...DialogProps}
            >
                <DialogTitle>
                    {dialogTitle}{' '}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <SaveContextProvider value={saveContext}>
                    {children}
                </SaveContextProvider>
            </Dialog>
        </>
    );
};

export interface BulkUpdateFormButtonProps<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown
> extends Omit<BulkUpdateButtonProps, 'data' | 'children'> {
    children: React.ReactNode;
    DialogProps?: Partial<DialogProps>;
    // RaBulkUpdateFormButtonProps will include mutationOptions in v4.12
    // but for now we need to add it manually
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        UpdateManyParams<RecordType>
    > & { meta?: any };
}

const defaultIcon = <CreateIcon />;

const sanitizeRestProps = ({
    filterValues,
    label,
    selectedIds,
    onSuccess,
    onError,
    mutationMode,
    mutationOptions,
    resource,
    icon,
    children,
    ...rest
}: Partial<BulkUpdateFormButtonProps>) => rest;

const PREFIX = 'RaBulkUpdateFormButton';

export const BulkUpdateFormButtonClasses = {
    root: `${PREFIX}-root`,
};

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    color: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        // Reset on mouse devices
        '@media (hover: none)': {
            backgroundColor: 'transparent',
        },
    },
}));
