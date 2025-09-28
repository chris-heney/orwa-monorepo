import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import CIWebModal from '../../../../_components/CIModal';
import EditServiceContext from './EditServiceContext';

const EditServiceContextModal = () => {
    const { setIsServiceContextModalOpen, isServiceContextModalOpen } = useServiceContext();

    if (!isServiceContextModalOpen.record) {
        return null;
    }   

    return (
        <CIWebModal
            isModalOpen={isServiceContextModalOpen.open}
            setIsModalOpen={() =>
                setIsServiceContextModalOpen({ open: false })
            }
        >
            <EditServiceContext />
        </CIWebModal>
    );
};

export default EditServiceContextModal;
