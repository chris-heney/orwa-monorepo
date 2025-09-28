import { Edit, SimpleForm } from 'react-admin';
import AppFormFields from './components/AppFormFields';

const AppEdit = () => (
    <Edit
        sx={{
            width: '100%',
            maxWidth: '100%',
            p: 0,
        }}
        component={'div'}
        redirect={false}
    >
        <SimpleForm
            // Using default React Admin toolbar with Save/Delete buttons
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
        >
            <AppFormFields />
        </SimpleForm>
    </Edit>
);

export default AppEdit;
