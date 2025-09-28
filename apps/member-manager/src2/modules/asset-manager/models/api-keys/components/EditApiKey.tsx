import ModalHeader from '../../../../../_components/ModalHeader';
import { Edit, SimpleForm } from 'react-admin';
import { ApiKeyFormFields } from './ApiKeyFormFields';

export const EditApiKey = () => (
    <Edit actions={false} title="Edit API Key">
        <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
            <ModalHeader
                title="Edit API Key"
                redirect="/api-key"
                backButton
                showButton
            />
            <ApiKeyFormFields isEdit={true} />
        </SimpleForm>
    </Edit>
);
