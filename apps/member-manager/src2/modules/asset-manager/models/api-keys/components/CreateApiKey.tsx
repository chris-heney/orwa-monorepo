import ModalHeader from '../../../../../_components/ModalHeader';
import { Create, SimpleForm } from 'react-admin';
import { ApiKeyFormFields } from './ApiKeyFormFields';

export const CreateApiKey = () => {
    return (
        <Create title="Create API Key">
            <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
                <ModalHeader
                    title="Create API Key"
                    redirect="/api-key"
                    backButton
                />
                <ApiKeyFormFields isEdit={false} />
            </SimpleForm>
        </Create>
    );
};
