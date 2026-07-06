import { useContext } from 'react';
import { RowContext } from './RowContext';

/**
 * A hook which returns a function to open or quit the edit mode of a row from the sideEffect of a custom form inside the <EditableDatagrid>.
 *
 * @example
 *     const ArtistList = () => (
 *         <List hasCreate>
 *             <EditableDatagrid
 *                 editForm={<ArtistForm />}
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
 *     const ArtistForm = () => {
 *         const { close } = useRowContext();
 *
 *         return (
 *             <RowForm onSuccess={() => close()}>
 *                 <TextField source="id" />
 *                 <TextInput source="firstname" validate={required()} />
 *                 <TextInput source="name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput
 *                     source="prof"
 *                     label="Profession"
 *                     choices={professionChoices}
 *                 />
 *             </RowForm>
 *         );
 *     };
 */
export const useRowContext = () => {
    const context = useContext(RowContext);

    if (!context && process.env.NODE_ENV === 'development') {
        console.error(
            'useEditRowContext cannot be called outside the RowForm passed as the `editForm` of the <EditableDatagrid> row.'
        );
    }

    return context;
};
