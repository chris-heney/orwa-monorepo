import {
    Create,
    SimpleForm,
    TopToolbar,
    ListButton,
} from 'react-admin';
import { DisplayConditionFormFields } from './DisplayConditionFormFields';

const DisplayConditionCreateActions = () => (
    <TopToolbar>
        <ListButton />
    </TopToolbar>
);

const DisplayConditionCreate = () => {
    return (
        <Create
            actions={<DisplayConditionCreateActions />}
            redirect="list"
        >
            <SimpleForm>
                <DisplayConditionFormFields />
            </SimpleForm>
        </Create>
    );
};

export default DisplayConditionCreate;
