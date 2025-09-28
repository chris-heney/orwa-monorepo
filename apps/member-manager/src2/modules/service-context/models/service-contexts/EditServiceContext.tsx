import React from 'react';
import {
    Edit,
    useRefresh,
    useDataProvider,
    useNotify,
} from 'react-admin';
import { SimpleForm } from 'react-admin';
import ModalHeader from '../../../../_components/ModalHeader';
import ServiceContextFormFields from './ServiceContextFormFields';
import { useServiceContext } from '../../ServiceContextProvider';
import { updateRecord } from '../../../../_utils/updateRecord';

const EditServiceContext = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const { setIsServiceContextModalOpen, isServiceContextModalOpen } = useServiceContext();

    return (
            <Edit 
            queryOptions={{
                meta: {
                   populate: "services,trades"
                }
            }}
            id={isServiceContextModalOpen.record?.id} 
            resource="service-context">
                <SimpleForm
                    onSubmit={(data: any) =>
                        updateRecord(
                            data,
                            isServiceContextModalOpen.record!,
                            dataProvider,
                            notify,
                            () =>
                                setIsServiceContextModalOpen({
                                    open: false,
                                }),
                            'service-context',
                            refresh
                        )
                    }
                    sx={{
                        p: 0,
                    }}
                >
                    <ModalHeader
                        title="Edit Service Context"
                        onClose={() => setIsServiceContextModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                    <ServiceContextFormFields />
                </SimpleForm>
            </Edit>
    );
};

export default EditServiceContext;
