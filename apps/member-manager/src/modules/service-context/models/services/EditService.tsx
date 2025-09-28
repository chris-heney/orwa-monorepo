import React from 'react';
import { Edit, useRefresh, useDataProvider, useNotify } from 'react-admin';
import { SimpleForm } from 'react-admin';
import ServiceFormFields from './ServiceFormFields';
import { useServiceContext } from '../../ServiceContextProvider';
import { updateRecord } from '../../../../_utils/updateRecord';
import ModalHeader from '../../../../_components/ModalHeader';

const EditService = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const { setIsServiceModalOpen, isServiceModalOpen } = useServiceContext();

    return (
        <Edit
            id={isServiceModalOpen.record?.id}
            resource="service"
            queryOptions={{
                meta: {
                    populate: 'serviceContexts',
                },
            }}
        >
            <SimpleForm
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        isServiceModalOpen.record!,
                        dataProvider,
                        notify,
                        () =>
                            setIsServiceModalOpen({
                                open: false,
                            }),
                        'service',
                        refresh
                    )
                }
                sx={{
                    p: 0,
                }}
            >
                <ModalHeader
                    title="Edit Service"
                    onClose={() => setIsServiceModalOpen({ open: false })}
                    redirect="/service-context"
                />
                <ServiceFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditService;
