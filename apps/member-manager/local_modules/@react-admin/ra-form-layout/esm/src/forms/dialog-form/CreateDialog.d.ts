import * as React from 'react';
import { ReactNode } from 'react';
import { CreateProps } from 'react-admin';
import { DialogProps, SxProps } from '@mui/material';
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
export declare const CreateDialog: ({ close, ...props }: CreateDialogProps) => React.JSX.Element;
export interface CreateDialogProps extends Omit<CreateProps, 'classes'>, Omit<DialogProps, 'open' | 'id' | 'title'>, Partial<FormDialogContextType> {
    children?: ReactNode;
    sx?: SxProps;
}
//# sourceMappingURL=CreateDialog.d.ts.map