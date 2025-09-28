import React, { createContext, useContext, useState, useCallback } from 'react';
import { useStore } from 'react-admin';
import { RaRecord } from 'react-admin';

interface ServiceContext {
    selectedServiceContextIds: number[];
    selectedServiceIds: number[];
    selectedIndustryIds: number[];
    selectedTradeIds: number[];
    setSelectedServiceContextIds: React.Dispatch<React.SetStateAction<number[]>>;
    setSelectedServiceIds: React.Dispatch<React.SetStateAction<number[]>>;
    setSelectedIndustryIds: React.Dispatch<React.SetStateAction<number[]>>;
    setSelectedTradeIds: React.Dispatch<React.SetStateAction<number[]>>;
    isServiceContextModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    isServiceModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    isIndustryModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    isTradeModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsServiceContextModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    setIsServiceModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    setIsIndustryModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    setIsTradeModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
}

const ServiceContextContext = createContext<ServiceContext>({
    selectedServiceContextIds: [],
    selectedServiceIds: [],
    selectedIndustryIds: [],
    selectedTradeIds: [],
    setSelectedServiceContextIds: () => {},
    setSelectedServiceIds: () => {},
    setSelectedIndustryIds: () => {},
    setSelectedTradeIds: () => {},
    isServiceContextModalOpen: {
        open: false,
        record: undefined,
    },
    isServiceModalOpen: {
        open: false,
        record: undefined,
    },
    isIndustryModalOpen: {
        open: false,
        record: undefined,
    },
    isTradeModalOpen: {
        open: false,
        record: undefined,
    },
    setIsServiceContextModalOpen: () => {},
    setIsServiceModalOpen: () => {},
    setIsIndustryModalOpen: () => {},
    setIsTradeModalOpen: () => {},
});

export const useServiceContext = () => useContext(ServiceContextContext);

const ServiceContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedServiceContextIds, setSelectedServiceContextIds] = useStore<number[]>('selectedServiceContextIds', []);
    const [selectedServiceIds, setSelectedServiceIds] = useStore<number[]>('selectedServiceIds', []);
    const [selectedIndustryIds, setSelectedIndustryIds] = useStore<number[]>('selectedIndustryIds', []);
    const [selectedTradeIds, setSelectedTradeIds] = useStore<number[]>('selectedTradeIds', []);

    const [isServiceContextModalOpen, setIsServiceContextModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    const [isServiceModalOpen, setIsServiceModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    const [isIndustryModalOpen, setIsIndustryModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    const [isTradeModalOpen, setIsTradeModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    return (
        <ServiceContextContext.Provider
            value={{
                selectedServiceContextIds,
                selectedServiceIds,
                selectedIndustryIds,
                selectedTradeIds,
                setSelectedServiceContextIds,
                setSelectedServiceIds,
                setSelectedIndustryIds,
                setSelectedTradeIds,
                isServiceContextModalOpen,
                isServiceModalOpen,
                isIndustryModalOpen,
                isTradeModalOpen,
                setIsServiceContextModalOpen,
                setIsServiceModalOpen,
                setIsIndustryModalOpen,
                setIsTradeModalOpen,
            }}
        >
            {children}
        </ServiceContextContext.Provider>
    );
};

export default ServiceContextProvider;
