import ModalHeader from '../../../../../_components/ModalHeader';
import { Create, SimpleForm } from 'react-admin';
import { SoftwareLicenseFormFields } from './SoftwareLicenseFormFields';

export const CreateSoftwareLicense = () => (
    <Create actions={false} title="Create Software License">
        <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
            <ModalHeader
                title="Create Software License"
                redirect="/software-license"
                backButton
            />
            <SoftwareLicenseFormFields isEdit={false} />
        </SimpleForm>
    </Create>
);
