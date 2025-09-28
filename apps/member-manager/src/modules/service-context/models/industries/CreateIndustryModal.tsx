import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import IndustryFormFields from './IndustryFormFields';
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

const CreateIndustryModal: React.FC = () => {
    const { isIndustryModalOpen, setIsIndustryModalOpen } = useServiceContext();

    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isIndustryModalOpen.open}
            setIsModalOpen={() => setIsIndustryModalOpen({ open: false })}
        >
            <Create resource="industry">
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,            
                            refresh,
                            'industry',
                            () => setIsIndustryModalOpen({ open: false }),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <ModalHeader
                        title="Create Industry"
                        onClose={() => setIsIndustryModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                    <IndustryFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateIndustryModal;
