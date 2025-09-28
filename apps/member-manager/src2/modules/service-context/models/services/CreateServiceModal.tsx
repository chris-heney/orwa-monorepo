import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceFormFields from './ServiceFormFields';
import CIWebModal from '../../../../_components/CIModal';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { createRecord } from '../../../../_utils/createRecord';
import ModalHeader from '../../../../_components/ModalHeader';

const CreateServiceModal: React.FC = () => {
    const { isServiceModalOpen, setIsServiceModalOpen } = useServiceContext();

    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isServiceModalOpen.open}
            setIsModalOpen={() => setIsServiceModalOpen({ open: false })}
        >
            <Create resource="service">
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,            
                            refresh,
                            'service',
                            () => setIsServiceModalOpen({ open: false }),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <ModalHeader
                        title="Create Service"
                        onClose={() => setIsServiceModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                    <ServiceFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateServiceModal;
