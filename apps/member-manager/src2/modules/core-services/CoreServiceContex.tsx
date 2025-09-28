import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { RaRecord, useStore } from 'react-admin';

interface ICoreServiceContextProvider {
    coreServiceIds: number[];
    setCoreServiceIds: React.Dispatch<React.SetStateAction<number[]>>;
    featureIds: number[];
    setFeatureIds: React.Dispatch<React.SetStateAction<number[]>>;
    packageIds: number[];
    setPackageIds: React.Dispatch<React.SetStateAction<number[]>>;
    packageGroupIds: number[];
    setPackageGroupIds: React.Dispatch<React.SetStateAction<number[]>>;
    isCoreServiceModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsCoreServiceModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    isPackageModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsPackageModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    isPackageGroupModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsPackageGroupModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    isFeatureModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsFeatureModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    isAddonGroupModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsAddonGroupModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    addonGroupIds: number[];
    setAddonGroupIds: React.Dispatch<React.SetStateAction<number[]>>;
    isAddonModalOpen: {
        open: boolean;
        record?: RaRecord;
    };
    setIsAddonModalOpen: React.Dispatch<
        React.SetStateAction<{
            open: boolean;
            record?: RaRecord;
        }>
    >;
    addonIds: number[];
    setAddonIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const ConferenceContext = createContext<ICoreServiceContextProvider>({
    coreServiceIds: [],
    setCoreServiceIds: () => {},
    featureIds: [],
    setFeatureIds: () => {},
    packageIds: [],
    setPackageIds: () => {},
    packageGroupIds: [],
    setPackageGroupIds: () => {},
    isCoreServiceModalOpen: {
        open: false,
        record: undefined,
    },
    setIsCoreServiceModalOpen: () => {},
    isPackageModalOpen: {
        open: false,
        record: undefined,
    },
    setIsPackageModalOpen: () => {},
    isPackageGroupModalOpen: {
        open: false,
        record: undefined,
    },
    setIsPackageGroupModalOpen: () => {},
    isFeatureModalOpen: {
        open: false,
        record: undefined,
    },
    isAddonModalOpen: {
        open: false,
        record: undefined,
    },
    setIsAddonModalOpen: () => {},
    setIsFeatureModalOpen: () => {},
    isAddonGroupModalOpen: {
        open: false,
        record: undefined,
    },
    setIsAddonGroupModalOpen: () => {},
    addonGroupIds: [],
    setAddonGroupIds: () => {},
    addonIds: [],
    setAddonIds: () => {},
});

export const useCoreServiceContext = () => useContext(ConferenceContext);

const CoreServiceContextProvider = ({ children }: PropsWithChildren) => {
    const [coreServiceIds, setCoreServiceIds] = useStore<number[]>(
        'coreServiceIds',
        []
    );
    const [featureIds, setFeatureIds] = useStore<number[]>('featureIds', []);
    const [packageIds, setPackageIds] = useStore<number[]>('packageIds', []);
    const [packageGroupIds, setPackageGroupIds] = useStore<number[]>(
        'packageGroupIds',
        []
    );
    const [addonGroupIds, setAddonGroupIds] = useStore<number[]>(
        'addonGroupIds',
        []
    );
    const [addonIds, setAddonIds] = useStore<number[]>('addonIds', []);

    const [isPackageModalOpen, setIsPackageModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });
    const [isPackageGroupModalOpen, setIsPackageGroupModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    const [isCoreServiceModalOpen, setIsCoreServiceModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });
    const [isAddonGroupModalOpen, setIsAddonGroupModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });
    const [isAddonModalOpen, setIsAddonModalOpen] = useState<{
        open: boolean;
        record?: RaRecord;
    }>({
        open: false,
        record: undefined,
    });

    return (
        <ConferenceContext.Provider
            value={{
                coreServiceIds,
                setCoreServiceIds,
                featureIds,
                setFeatureIds,
                packageIds,
                setPackageIds,
                packageGroupIds,
                setPackageGroupIds,
                isPackageModalOpen,
                setIsPackageModalOpen,
                isPackageGroupModalOpen,
                setIsPackageGroupModalOpen,
                isFeatureModalOpen,
                setIsFeatureModalOpen,
                isCoreServiceModalOpen,
                setIsCoreServiceModalOpen,
                isAddonGroupModalOpen,
                setIsAddonGroupModalOpen,
                addonGroupIds,
                setAddonGroupIds,
                isAddonModalOpen,
                setIsAddonModalOpen,
                addonIds,
                setAddonIds,
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
};

export default CoreServiceContextProvider;
