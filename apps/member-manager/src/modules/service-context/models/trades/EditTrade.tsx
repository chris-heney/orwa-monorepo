import React from 'react';
import { Edit, useRefresh, useDataProvider, useNotify } from 'react-admin';
import { SimpleForm } from 'react-admin';
import TradeFormFields from './TradeFormFields';
import { useServiceContext } from '../../ServiceContextProvider';
import { updateRecord } from '../../../../_utils/updateRecord';
import ModalHeader from '../../../../_components/ModalHeader';

const EditTrade = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const { setIsTradeModalOpen, isTradeModalOpen } = useServiceContext() ?? {};

    return (
        <Edit
            id={isTradeModalOpen.record?.id}
            resource="trade"
            queryOptions={{
                meta: {
                    populate: '*',
                },
            }}
        >
            <SimpleForm
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        isTradeModalOpen.record!,
                        dataProvider,
                        notify,
                        () =>
                            setIsTradeModalOpen({
                                open: false,
                            }),
                        'trade',
                        refresh
                    )
                }
                sx={{
                    p: 0,
                }}
            >
                <ModalHeader
                    title="Edit Trade"
                    onClose={() => setIsTradeModalOpen({ open: false })}
                    redirect="/service-context"
                />
                <TradeFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditTrade;
