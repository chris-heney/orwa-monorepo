import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceContextReusableList from '../../components/ReusableList';

const ServiceContextList = () => {
    const {
        selectedServiceContextIds,
        setSelectedServiceContextIds,
        setIsServiceContextModalOpen,
        selectedServiceIds,
        selectedTradeIds,
    } = useServiceContext();

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
    ];

    const filter = {
        'services.id': selectedServiceIds,
        'trades.id': selectedTradeIds,
    };

    return (
        <ServiceContextReusableList
            resource="serviceContext"
            raResource="service-context"
            fields={fields}
            selectedIds={selectedServiceContextIds}
            setSelectedIds={setSelectedServiceContextIds}
            setModalOpen={setIsServiceContextModalOpen}
            title="Service Contexts"
            emptyTitle="No service contexts found for the selected services and trades."
            createButtonText="Create Service Context"
            filter={filter}
        />
    );
};

export default ServiceContextList;
