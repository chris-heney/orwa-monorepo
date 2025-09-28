import {
    Edit,
    SimpleForm,
    TopToolbar,
    ListButton,
    ShowButton,
    DeleteButton,
} from 'react-admin';
import { DisplayConditionFormFields } from './DisplayConditionFormFields';

const DisplayConditionEditActions = () => (
    <TopToolbar>
        <ShowButton />
        <ListButton />
        <DeleteButton />
    </TopToolbar>
);

const DisplayConditionEdit = () => {
    return (
        <Edit
            actions={<DisplayConditionEditActions />}
            redirect="show"
        >
            <SimpleForm>
                <DisplayConditionFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default DisplayConditionEdit;
