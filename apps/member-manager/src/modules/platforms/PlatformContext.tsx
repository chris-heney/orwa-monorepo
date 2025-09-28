import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { RaRecord, useStore } from 'react-admin';

interface IPlatformContextProvider {
    platformIds: number[];
    setPlatformIds: React.Dispatch<React.SetStateAction<number[]>>;
    platformGroupIds: number[];
    setPlatformGroupIds: React.Dispatch<React.SetStateAction<number[]>>;

    isPlatformModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsPlatformModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;

    isPlatformGroupModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsPlatformGroupModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
}

const PlatformContext = createContext<IPlatformContextProvider>(
    {} as IPlatformContextProvider
);

const PlatformContextProvider = ({ children }: PropsWithChildren) => {
    const [platformIds, setPlatformIds] = useStore('platform-ids', []);
    const [platformGroupIds, setPlatformGroupIds] = useStore(
        'platform-group-ids',
        []
    );

    const [isPlatformModalOpen, setIsPlatformModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    const [isPlatformGroupModalOpen, setIsPlatformGroupModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    return (
        <PlatformContext.Provider
            value={{
                platformIds,
                setPlatformIds,
                platformGroupIds,
                setPlatformGroupIds,
                isPlatformModalOpen,
                setIsPlatformModalOpen,
                isPlatformGroupModalOpen,
                setIsPlatformGroupModalOpen,
            }}
        >
            {children}
        </PlatformContext.Provider>
    );
};

export const usePlatformContext = () => {
    const context = useContext(PlatformContext);
    if (!context) {
        throw new Error(
            'usePlatformContext must be used within a PlatformContextProvider'
        );
    }
    return context;
};

export default PlatformContextProvider;
