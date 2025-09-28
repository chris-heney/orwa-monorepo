import ModalHeader from '../../../../../_components/ModalHeader';
import { Edit, SimpleForm } from 'react-admin';
import { ServerFormFields } from './ServerFormFields';

export const EditServer = () => (
    <Edit actions={false} title="Edit Server">
        <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
            <ModalHeader
                title="Edit Server"
                redirect="/server"
                backButton
                deleteButton
                showButton
            />
            <ServerFormFields isEdit={true} />
        </SimpleForm>
    </Edit>
);
