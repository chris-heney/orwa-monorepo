import CIWebModal from '../../../../_components/CIModal';
import { usePlatformContext } from "../../PlatformContext";
import EditPlatform from "./EditPlatform";

const EditPlatformModal = () => {
    const { isPlatformModalOpen, setIsPlatformModalOpen } =
        usePlatformContext();

    return (
        <CIWebModal
            isModalOpen={
                isPlatformModalOpen.open && !!isPlatformModalOpen.record
            }
            setIsModalOpen={() =>
                setIsPlatformModalOpen({ open: false, record: undefined })
            }
        >
            <EditPlatform />
        </CIWebModal>
    );
};

export default EditPlatformModal;
