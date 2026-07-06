import * as React from 'react';
import { ReactNode } from 'react';
import { EditProps } from 'react-admin';
import { DialogProps, SxProps } from '@mui/material';
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
export declare const EditDialog: ({ close, ...props }: EditDialogProps) => React.JSX.Element;
export interface EditDialogProps extends Omit<EditProps, 'classes'>, Omit<DialogProps, 'open' | 'id' | 'title'>, Partial<FormDialogContextType> {
    children?: ReactNode;
    sx?: SxProps;
}
//# sourceMappingURL=EditDialog.d.ts.map