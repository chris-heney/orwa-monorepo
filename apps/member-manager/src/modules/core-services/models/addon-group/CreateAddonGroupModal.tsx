import CIWebModal from '../../../../_components/CIModal';
import { useCoreServiceContext } from '../../CoreServiceContex';
import CreateAddonGroup from './CreateAddonGroup';

const CreateAddonGroupModal = () => {

    const { isAddonGroupModalOpen, setIsAddonGroupModalOpen } =
        useCoreServiceContext();

    return (
        <CIWebModal
            isModalOpen={isAddonGroupModalOpen.open}
            setIsModalOpen={() => setIsAddonGroupModalOpen({ open: false, record: undefined })}
        >

            <CreateAddonGroup />
        </CIWebModal>
    );
};

export default CreateAddonGroupModal;
