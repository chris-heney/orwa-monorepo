import { Edit, SimpleForm } from 'react-admin';
import UserFormFields from './components/UserFormFields';

export const UserEdit = () => {
    return (
        <Edit redirect="show">
            <SimpleForm>
                <UserFormFields />
            </SimpleForm>
        </Edit>
    );
};
