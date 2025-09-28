import React from 'react';
import { useServiceContext } from '../../ServiceContextProvider';
import ServiceContextReusableList from '../../components/ReusableList';

const TradeList = () => {
    const {
        selectedTradeIds,
        setSelectedTradeIds,
        setIsTradeModalOpen,
        selectedIndustryIds,
        selectedServiceContextIds,
    } = useServiceContext();

    const fields = [
        { source: 'name', label: 'Name' },
        { source: 'description', label: 'Description' },
    ];

    const filter = {
        'industries.id': selectedIndustryIds,
        'serviceContexts.id': selectedServiceContextIds,
    };

    return (
        <ServiceContextReusableList
            resource="trade"
            raResource="trade"
            fields={fields}
            selectedIds={selectedTradeIds}
            setSelectedIds={setSelectedTradeIds}
            setModalOpen={setIsTradeModalOpen}
            title="Trades"
            emptyTitle="No trades found."
            createButtonText="Create Trade"
            filter={filter}
        />
    );
};

export default TradeList;
