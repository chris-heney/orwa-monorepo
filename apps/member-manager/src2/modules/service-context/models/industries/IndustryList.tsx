import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceContextReusableList from '../../components/ReusableList';

const IndustryList = () => {
    const { 
        selectedIndustryIds, 
        setSelectedIndustryIds, 
        setIsIndustryModalOpen 
    } = useServiceContext();

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
    ];

    return (
        <ServiceContextReusableList
            resource="industry"
            raResource="industry"
            fields={fields}
            selectedIds={selectedIndustryIds}
            setSelectedIds={setSelectedIndustryIds}
            setModalOpen={setIsIndustryModalOpen}
            title="Industries"
            emptyTitle="No industries found."
            createButtonText="Create Industry"
        />
    );
};

export default IndustryList;
