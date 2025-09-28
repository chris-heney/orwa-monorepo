import React from 'react';
import { Edit, useRefresh, useDataProvider, useNotify } from 'react-admin';
import { SimpleForm } from 'react-admin';
import ModalHeader from '../../../../_components/ModalHeader';
import IndustryFormFields from './IndustryFormFields';
import { useServiceContext } from '../../ServiceContextProvider';
import { updateRecord } from '../../../../_utils/updateRecord';

const EditIndustry = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const { setIsIndustryModalOpen, isIndustryModalOpen } = useServiceContext()

    return (
            <Edit
                id={isIndustryModalOpen.record?.id}
                resource="industry"
            >
                <SimpleForm
                    onSubmit={(data: any) =>
                        updateRecord(
                            data,
                            data,
                            dataProvider,
                            notify,
                            () =>
                                setIsIndustryModalOpen({
                                    open: false,
                                }),
                            'industry',
                            refresh
                        )
                    }
                    sx={{
                        p: 0,
                    }}
                >
                    <ModalHeader
                        title="Edit Industry"
                        onClose={() => setIsIndustryModalOpen({ open: false })}
                        redirect="/service-context"
                    />
                    <IndustryFormFields />
                </SimpleForm>
            </Edit>
    );
};

export default EditIndustry;
