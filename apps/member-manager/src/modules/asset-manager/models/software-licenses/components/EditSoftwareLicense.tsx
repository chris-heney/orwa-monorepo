import ModalHeader from '../../../../../_components/ModalHeader';
import { Edit, SimpleForm } from 'react-admin';
import { SoftwareLicenseFormFields } from './SoftwareLicenseFormFields';

export const EditSoftwareLicense = () => (
    <Edit actions={false} title="Edit Software License">
        <SimpleForm sx={{ width: '100%', maxWidth: 'none', p: 0 }}>
            <ModalHeader
                title="Edit Software License"
                redirect="/software-license"
                backButton
                deleteButton
                showButton
            />
            <SoftwareLicenseFormFields isEdit={true} />
        </SimpleForm>
    </Edit>
);
