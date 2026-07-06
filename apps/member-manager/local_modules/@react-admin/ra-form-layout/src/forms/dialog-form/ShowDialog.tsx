import * as React from 'react';
import { ReactElement } from 'react';
import {
    ShowContextProvider,
    ShowProps,
    useShowController,
    useRedirect,
    useResourceContext,
    useRecordContext,
    useEvent,
} from 'react-admin';
import { Dialog, DialogProps, SxProps } from '@mui/material';
import { FormDialogTitle } from './FormDialogTitle';
import { useParams, Routes, Route } from 'react-router-dom';
import { useFormDialogContext } from './useFormDialogContext';
import { FormDialogContextType } from './FormDialogContext';

/**
 * A component which displays a show layout inside a dialog.
 *
 * By default, this components manages the open/close state of the dialog via the router.
 * In case it is used inside a `<FormDialogContext>`, or if the `isOpen`, `open` and `close`
 * props are provided directly, then the open/close state is managed by these values instead.
 *
 * @param {ShowDialogProps} props
 *
 * @example
 * const PostList = () => (
 *     <>
 *         <List>
 *             <Datagrid>
 *                 ...
 *             </Datagrid>
 *         </List>
 *         <ShowDialog>
 *             <SimpleShowLayout>
 *                 <TextField source="id" />
 *                 <TextField source="first_name" />
 *                 <TextField source="last_name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField source="sex" choices={sexChoices} />
 *             </SimpleShowLayout>
 *         </ShowDialog>
 *     </>
 * );
 *
 * @example with a managed state
 * const CustomerShowForm = () => {
 *     const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
 *     const openShowDialog = useCallback(() => {
 *         setIsShowDialogOpen(true);
 *     }, []);
 *     const closeShowDialog = useCallback(() => {
 *         setIsShowDialogOpen(false);
 *     }, []);
 *
 *     return (
 *         <SimpleForm>
 *             <Button
 *                 label="Show customer #1"
 *                 onClick={() => openShowDialog()}
 *             />
 *             <ShowDialog
 *                 fullWidth
 *                 maxWidth="md"
 *                 isOpen={isShowDialogOpen}
 *                 open={openShowDialog}
 *                 close={closeShowDialog}
 *                 resource="customers"
 *                 record={{ id: 1 }}
 *             >
 *                 <CustomerSimpleShowLayout />
 *             </ShowDialog>
 *         </SimpleForm>
 *     );
 * };
 */
export const ShowDialog = ({ close, ...props }: ShowDialogProps) => {
    const resource = useResourceContext(props);
    const context = useFormDialogContext(props);
    const record = useRecordContext(props);
    const closeEvent = useEvent(context?.close ?? close);

    if (context) {
        return (
            <ShowDialogView
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
                path=":id/show/*"
                element={
                    <ShowDialogView
                        resource={resource}
                        {...props}
                        close={close != null ? closeEvent : undefined}
                    />
                }
            />
        </Routes>
    );
};

const ShowDialogView = ({ close, ...props }: ShowDialogViewProps) => {
    const redirect = useRedirect();
    const params = useParams<'id'>();

    const handleClose = (event, reason): void => {
        if (close) {
            close(event, reason);
        } else {
            redirect('list', props.resource, undefined, undefined, {
                _scrollToTop: false,
            });
        }
    };

    const isMatch = params.id && params.id !== 'create';
    const open = props.isOpen ?? isMatch;

    return (
        <Dialog
            open={open}
            aria-labelledby="show-dialog-title"
            onClose={handleClose}
            data-testid="show-dialog"
            {...sanitizeRestProps(props)}
        >
            {open ? (
                <ShowDialogContentView {...props} onClose={handleClose} />
            ) : null}
        </Dialog>
    );
};

const ShowDialogContentView = ({
    children,
    onClose,
    title,
    emptyWhileLoading = false,
    ...props
}: ShowDialogViewProps & {
    onClose: FormDialogContextType['close'];
}) => {
    const controllerProps = useShowController(props as ShowProps);
    const { defaultTitle, record } = controllerProps;

    if (!children || (!record && emptyWhileLoading)) {
        return null;
    }

    return (
        <>
            <ShowContextProvider value={controllerProps}>
                <FormDialogTitle
                    id="show-dialog-title"
                    title={title}
                    defaultTitle={defaultTitle}
                    onClose={onClose}
                    record={record}
                />
                {children}
            </ShowContextProvider>
        </>
    );
};

export interface ShowDialogProps
    extends Omit<ShowProps, 'classes'>,
        Omit<DialogProps, 'open' | 'id' | 'title'>,
        Partial<FormDialogContextType> {
    children: ReactElement;
    sx?: SxProps;
}

interface ShowDialogViewProps extends ShowDialogProps {
    children: ReactElement;
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
    queryOptions = null,
    options = null,
    permissions = null,
    successMessage = null,
    title = null,
    isOpen = null,
    open = null,
    close = null,
    emptyWhileLoading = null,
    ...rest
}): any => rest;

/* eslint-enable @typescript-eslint/no-unused-vars */
