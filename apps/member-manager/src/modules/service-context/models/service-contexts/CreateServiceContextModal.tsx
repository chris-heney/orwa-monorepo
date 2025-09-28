import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceContextFormFields from './ServiceContextFormFields';
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

const CreateServiceContextModal: React.FC = () => {
    const { isServiceContextModalOpen, setIsServiceContextModalOpen } = useServiceContext();

    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isServiceContextModalOpen.open}
            setIsModalOpen={() => setIsServiceContextModalOpen({ open: false })}
        >
            <Create
                resource="service-context"
            >
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,            
                            refresh,
                            'service-context',
                            () => setIsServiceContextModalOpen({ open: false }),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <ModalHeader
                        title="Create Service Context"
                        onClose={() => setIsServiceContextModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                    <ServiceContextFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateServiceContextModal;
