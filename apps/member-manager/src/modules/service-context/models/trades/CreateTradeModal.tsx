import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import TradeFormFields from './TradeFormFields';
import CIWebModal from '../../../../_components/CIModal';
import {
    Create,
    SimpleForm,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import { createRecord } from '../../../../_utils/createRecord';
import CustomHeader from '../../../../_components/CustomHeader';
import ModalHeader from '../../../../_components/ModalHeader';

const CreateTradeModal: React.FC = () => {
    const { isTradeModalOpen, setIsTradeModalOpen } = useServiceContext();

    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    return (
        <CIWebModal
            isModalOpen={isTradeModalOpen.open}
            setIsModalOpen={() => setIsTradeModalOpen({ open: false })}
        >
            <Create resource="trade">
                <SimpleForm
                    onSubmit={(data: any) =>
                        createRecord(
                            data,
                            dataProvider,
                            notify,            
                            refresh,
                            'trade',
                            () => setIsTradeModalOpen({ open: false }),
                        )
                    }
                    sx={{
                        p: 0
                    }}
                >
                    <ModalHeader
                        title="Create Trade"
                        onClose={() => setIsTradeModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                        <TradeFormFields />
                </SimpleForm>
            </Create>
        </CIWebModal>
    );
};

export default CreateTradeModal;
