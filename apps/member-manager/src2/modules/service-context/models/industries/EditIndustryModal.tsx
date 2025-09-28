import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import CIWebModal from '../../../../_components/CIModal';
import EditIndustry from './EditIndustry';
        
const EditIndustryModal = () => {

    const { setIsIndustryModalOpen, isIndustryModalOpen } = useServiceContext() ?? {};

    if (!isIndustryModalOpen.record) {
        return null;
    }

    return (
        <CIWebModal
            isModalOpen={isIndustryModalOpen.open}
            setIsModalOpen={() => setIsIndustryModalOpen({ open: false })}
        >
            <EditIndustry />
        </CIWebModal>
    );
};

export default EditIndustryModal;
