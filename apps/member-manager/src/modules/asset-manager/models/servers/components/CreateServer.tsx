import ModalHeader from '../../../../../_components/ModalHeader';
import { Create, SimpleForm } from 'react-admin';
import { ServerFormFields } from './ServerFormFields';

export const CreateServer = () => (
    <Create actions={false} title="Create Server">
        <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
            <ModalHeader title="Create Server" redirect="/server" backButton />
            <ServerFormFields isEdit={false} />
        </SimpleForm>
    </Create>
);
