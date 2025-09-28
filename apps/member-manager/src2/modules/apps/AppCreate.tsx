import { Create, SimpleForm } from 'react-admin';
import AppFormFields from './components/AppFormFields';

const AppCreate = () => (
    <Create
        sx={{
            width: '100%',
            maxWidth: '100%',
            p: 0,
        }}
        component={'div'}
        redirect={'edit'}
    >
        <SimpleForm
            // Using default React Admin toolbar with Save/Delete buttons
            sx={{
                width: '100%',
                maxWidth: '100%',
                p: 0,
            }}
            // Set default values for required fields
            defaultValues={{
                name: '',
                url: '',
                description: '',
                category: 'OTHER',
                icon: '📱', // Default icon
                color: '#6C5CE7', // Default color
                order: 1,
                isActive: true,
            }}
        >
            <AppFormFields />
        </SimpleForm>
    </Create>
);

export default AppCreate;
