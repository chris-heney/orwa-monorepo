import CIWebModal from '../../../../_components/CIModal';
import { usePlatformContext } from "../../PlatformContext";
import CreatePlatformGroup from "./CreatePlatformGroup";

const CreatePlatformGroupModal = () => {
    const { isPlatformGroupModalOpen, setIsPlatformGroupModalOpen } =
        usePlatformContext();

    return (
        <CIWebModal
            isModalOpen={isPlatformGroupModalOpen.open}
            setIsModalOpen={() =>
                setIsPlatformGroupModalOpen({ open: false, record: undefined })
            }
        >
            <CreatePlatformGroup />
        </CIWebModal>
    );
};

export default CreatePlatformGroupModal;
