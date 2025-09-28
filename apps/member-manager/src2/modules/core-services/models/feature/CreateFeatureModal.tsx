import React from 'react';
import { useCoreServiceContext } from '../../CoreServiceContex';
import CIWebModal from '../../../../_components/CIModal';
import CreateFeature from './CreateFeature';

const CreateFeatureModal = () => {
    const { isFeatureModalOpen, setIsFeatureModalOpen } =
        useCoreServiceContext();

    return (
        <CIWebModal
            isModalOpen={isFeatureModalOpen.open}
            setIsModalOpen={() => setIsFeatureModalOpen({ open: false })}
        >
            <CreateFeature />
        </CIWebModal>
    );
};

export default CreateFeatureModal;
