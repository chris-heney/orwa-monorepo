import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import CIWebModal from '../../../../_components/CIModal';
import EditService from './EditService';

const EditServiceModal = () => {
    const { setIsServiceModalOpen, isServiceModalOpen } = useServiceContext();

    if (!isServiceModalOpen.record) {
        return null;
    }   

    return (
        <CIWebModal
            isModalOpen={isServiceModalOpen.open}
            setIsModalOpen={() =>
                setIsServiceModalOpen({ open: false })
            }
        >
            <EditService />
        </CIWebModal>
    );
};

export default EditServiceModal;
