"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRowContext = void 0;
var react_1 = require("react");
var RowContext_1 = require("./RowContext");
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
var useRowContext = function () {
    var context = (0, react_1.useContext)(RowContext_1.RowContext);
    if (!context && process.env.NODE_ENV === 'development') {
        console.error('useEditRowContext cannot be called outside the RowForm passed as the `editForm` of the <EditableDatagrid> row.');
    }
    return context;
};
exports.useRowContext = useRowContext;
