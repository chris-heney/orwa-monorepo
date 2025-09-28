import CIWebModal from '../../../../_components/CIModal';
import { usePlatformContext } from "../../PlatformContext";
import CreatePlatform from "./CreatePlatform";

const CreatePlatformModal = () => {
    const { isPlatformModalOpen, setIsPlatformModalOpen } =
        usePlatformContext();

    return (
        <CIWebModal
            isModalOpen={isPlatformModalOpen.open}
            setIsModalOpen={() =>
                setIsPlatformModalOpen({ open: false, record: undefined })
            }
        >
            <CreatePlatform />
        </CIWebModal>
    );
};

export default CreatePlatformModal;
