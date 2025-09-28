import React, { useState } from 'react';
import { Edit, SimpleForm } from 'react-admin';
import { useNotify, useRefresh, useDataProvider } from 'react-admin';
import FeatureFormFields from './FeatureFormFields';
import { updateRecord } from '../../../../_utils';
import { CustomHeader } from '../../../../_components';
import { useCoreServiceContext } from '../../CoreServiceContex';

const EditFeature = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const { isFeatureModalOpen, setIsFeatureModalOpen } =
        useCoreServiceContext();

    return (
        <Edit 
        resource="feature" 
        id={isFeatureModalOpen?.record?.id} 
        redirect={false}
        queryOptions={{
            meta: {
                populate: ['packages'],
            },
        }}
        >
            <SimpleForm
                sx={{
                    p: 0,
                }}
                onSubmit={(data: any) =>
                    updateRecord(
                        data,
                        data,
                        dataProvider,
                        notify,
                        refresh,
                        'feature',
                        () => setIsFeatureModalOpen({ open: false })
                    )
                }
            >
                <CustomHeader title="Edit Feature" />
                <FeatureFormFields />
            </SimpleForm>
        </Edit>
    );
};

export default EditFeature;
