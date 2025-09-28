import CIWebModal from '../../../../_components/CIModal';
import { useCoreServiceContext } from '../../CoreServiceContex';
import CreateCoreService from './CreateCoreService';
const CreateCoreServiceModal = () => {
    const { isCoreServiceModalOpen, setIsCoreServiceModalOpen } =
        useCoreServiceContext();

    return (
        <CIWebModal
            isModalOpen={isCoreServiceModalOpen.open}
            setIsModalOpen={() => setIsCoreServiceModalOpen({ open: false, record: undefined })}
        >

            <CreateCoreService />
        </CIWebModal>
    );
};

export default CreateCoreServiceModal;
