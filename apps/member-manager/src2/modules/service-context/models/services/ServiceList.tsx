import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceContextReusableList from '../../components/ReusableList';

const ServiceList = () => {
    const {
        selectedServiceIds,
        setSelectedServiceIds,
        selectedServiceContextIds,
        setIsServiceModalOpen,
    } = useServiceContext();

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
    ];

    const filter = {
        'serviceContexts.id': selectedServiceContextIds,
    };

    return (
        <ServiceContextReusableList
            resource="service"
            raResource="service"
            fields={fields}
            selectedIds={selectedServiceIds}
            setSelectedIds={setSelectedServiceIds}
            setModalOpen={setIsServiceModalOpen}
            title="Services"
            emptyTitle="No services found for the selected service contexts."
            createButtonText="Create Service"
            filter={filter}
        />
    );
};

export default ServiceList;
