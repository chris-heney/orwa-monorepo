import { FC, ReactElement } from 'react';
import { DatagridProps, MutationMode } from 'react-admin';
/**
 * Component to display and edit tabular data.
 *
 * To be used as child of <List> or <ReferenceManyField>.
 * The <EditableDatagrid> expects the same props as <Datagrid>, plus 5 more props:
 *
 * - editForm: a component to display instead of a row when the user edits a record
 * - createForm: a component to display as the first row when the user creates a record
 * - noDelete: disable the inline Delete button
 * - actions: a component to display instead of the default actions
 * - mutationMode: the mutation mode to use for the inline form (default to undoable)
 *
 * The component renders the editForm and createForm elements in a <table>, so they
 * should render a <tr>. We advise you to use <RowForm> for editForm and createForm.
 *
 * Note: No need to include an <EditButton> as child, the <EditableDatagrid>
 * component adds a column with edit/delete/save/cancel buttons itself.
 *
 * Note: To display a custom create button, pass a custom component as the `empty` prop. It can use the `useEditableDatagridContext` hook to access to `openStandaloneCreateForm` and `closeStandaloneCreateForm` callbacks.
 *
 * Note: To enable the create form in a <List>, you should add the `hasCreate`
 * prop to the <List> component.
 *
 * @example
 *
 *     const ArtistList = () => (
 *         <List hasCreate>
 *             <EditableDatagrid
 *                 createForm={<ArtistForm />}
 *                 editForm={<ArtistForm />}
 *                 empty={<CustomEmptyComponent />}
 *             >
 *                 <TextField source="id" />
 *                 <TextField source="firstname" />
 *                 <TextField source="name" />
 *                 <DateField source="dob" label="born" />
 *                 <SelectField
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </EditableDatagrid>
 *         </List>
 *     );
 *
 *      const CustomEmptyComponent = () => {
 *          const { openStandaloneCreateForm } = useEditableDatagridContext();
 *
 *          const handleClick = () => {
 *              openStandaloneCreateForm();
 *          };
 *          return (
 *              <>
 *                  <p>Here a custom empty component</p>
 *                  <Button
 *                      size="small"
 *                      color="primary"
 *                      variant="outlined"
 *                      onClick={handleClick}
 *                  >
 *                      Custom Create Button
 *                  </Button>
 *              </>
 *          );
 *      };
 *
 *     const ArtistForm = () => (
 *         <RowForm>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @example // inside a <ReferenceManyField> - remember to set the foreign ket in the createForm using defaultValues
 *
 *     const OrderEdit = () => (
 *         <Edit>
 *             <SimpleForm>
 *                 <ReferenceManyField
 *                     fullWidth
 *                     label="Products"
 *                     reference="products"
 *                     target="order_id"
 *                 >
 *                     <EditableDatagrid
 *                         createForm={<ProductForm />}
 *                         editForm={<ProductForm />}
 *                     >
 *                         <TextField source="id" />
 *                         <TextField source="name" />
 *                         <NumberField source="price" label="Default Price" />
 *                         <DateField source="available_since" />
 *                     </EditableDatagrid>
 *                 </ReferenceManyField>
 *                 <DateInput source="purchase_date" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     const ProductForm = () => {
 *         const orderRecord = useRecordContext();
 *
 *         return (
 *             <RowForm defaultValues={{ order_id: orderRecord.id }}>
 *                 <TextField source="id" disabled />
 *                 <TextInput source="name" validate={required()} />
 *                 <NumberInput
 *                     source="price"
 *                     label="Default Price"
 *                     validate={required()}
 *                 />
 *                 <DateInput source="available_since" validate={required()} />
 *             </RowForm>
 *         );
 *     };
 *
 * @see Datagrid for the other props
 * @see RowForm for the create and edit form
 */
declare const EditableDatagrid: FC<EditableDatagridProps>;
export declare const DatagridClasses: {
    root: string;
    table: string;
    tableWrapper: string;
    thead: string;
    tbody: string;
    headerRow: string;
    headerCell: string;
    checkbox: string;
    row: string;
    clickableRow: string;
    rowEven: string;
    rowOdd: string;
    rowCell: string;
    expandHeader: string;
    expandIconCell: string;
    expandIcon: string;
    expanded: string;
    expandedPanel: string;
};
export interface EditableDatagridProps extends DatagridProps {
    actions?: ReactElement | false;
    editForm: ReactElement;
    createForm?: ReactElement;
    mutationMode?: MutationMode;
    noDelete?: boolean;
}
export default EditableDatagrid;
//# sourceMappingURL=EditableDatagrid.d.ts.map