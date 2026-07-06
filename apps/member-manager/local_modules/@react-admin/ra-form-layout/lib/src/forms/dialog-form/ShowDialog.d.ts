import * as React from 'react';
import { ReactElement } from 'react';
import { ShowProps } from 'react-admin';
import { DialogProps, SxProps } from '@mui/material';
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
export declare const ShowDialog: ({ close, ...props }: ShowDialogProps) => React.JSX.Element;
export interface ShowDialogProps extends Omit<ShowProps, 'classes'>, Omit<DialogProps, 'open' | 'id' | 'title'>, Partial<FormDialogContextType> {
    children: ReactElement;
    sx?: SxProps;
}
//# sourceMappingURL=ShowDialog.d.ts.map