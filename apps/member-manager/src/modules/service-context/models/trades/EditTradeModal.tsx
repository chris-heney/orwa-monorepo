import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import CIWebModal from '../../../../_components/CIModal';
import EditTrade from './EditTrade';

const EditTradeModal = () => {
    const { setIsTradeModalOpen, isTradeModalOpen } = useServiceContext() ?? {};

    if (!isTradeModalOpen.record) {
        return null;
    }   

    return (
        <CIWebModal
            isModalOpen={isTradeModalOpen.open}
            setIsModalOpen={() =>
                setIsTradeModalOpen({ open: false })
            }
        >
            <EditTrade />
        </CIWebModal>
    );
};

export default EditTradeModal;
