import CIWebModal from '../../../../_components/CIModal';
import { usePlatformContext } from "../../PlatformContext";
import EditPlatformGroup from "./EditPlatformGroup";

const EditPlatformGroupModal = () => {
    const { isPlatformGroupModalOpen, setIsPlatformGroupModalOpen } =
        usePlatformContext();

    return (
        <CIWebModal
            isModalOpen={
                isPlatformGroupModalOpen.open &&
                !!isPlatformGroupModalOpen.record
            }
            setIsModalOpen={() =>
                setIsPlatformGroupModalOpen({ open: false, record: undefined })
            }
        >
            <EditPlatformGroup />
        </CIWebModal>
    );
};

export default EditPlatformGroupModal;
