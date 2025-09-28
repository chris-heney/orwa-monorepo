import React, { createContext, ReactNode, useContext, useState } from 'react';
import { RaRecord } from 'react-admin';

interface AssetManagerContextType {
    // API Keys
    selectedApiKeyIds: number[];
    setSelectedApiKeyIds: (ids: number[]) => void;
    apiKeyModalOpen: boolean;
    setApiKeyModalOpen: (open: boolean) => void;
    apiKeyModalRecord?: RaRecord;
    setApiKeyModalRecord: (record?: RaRecord) => void;

    // Software Licenses
    selectedSoftwareLicenseIds: number[];
    setSelectedSoftwareLicenseIds: (ids: number[]) => void;
    softwareLicenseModalOpen: boolean;
    setSoftwareLicenseModalOpen: (open: boolean) => void;
    softwareLicenseModalRecord?: RaRecord;
    setSoftwareLicenseModalRecord: (record?: RaRecord) => void;

    // Servers
    selectedServerIds: number[];
    setSelectedServerIds: (ids: number[]) => void;
    serverModalOpen: boolean;
    setServerModalOpen: (open: boolean) => void;
    serverModalRecord?: RaRecord;
    setServerModalRecord: (record?: RaRecord) => void;

    // Copy functionality
    copyToClipboard: (text: string, type: string) => void;
    copySuccess: string;
    setCopySuccess: (message: string) => void;
}

const AssetManagerContext = createContext<AssetManagerContextType | undefined>(
    undefined
);

export const useAssetManagerContext = () => {
    const context = useContext(AssetManagerContext);
    if (!context) {
        throw new Error(
            'useAssetManagerContext must be used within an AssetManagerProvider'
        );
    }
    return context;
};

interface AssetManagerProviderProps {
    children: ReactNode;
}

export const AssetManagerProvider: React.FC<AssetManagerProviderProps> = ({
    children,
}) => {
    // API Keys state
    const [selectedApiKeyIds, setSelectedApiKeyIds] = useState<number[]>([]);
    const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
    const [apiKeyModalRecord, setApiKeyModalRecord] = useState<
        RaRecord | undefined
    >();

    // Software Licenses state
    const [selectedSoftwareLicenseIds, setSelectedSoftwareLicenseIds] =
        useState<number[]>([]);
    const [softwareLicenseModalOpen, setSoftwareLicenseModalOpen] =
        useState(false);
    const [softwareLicenseModalRecord, setSoftwareLicenseModalRecord] =
        useState<RaRecord | undefined>();

    // Servers state
    const [selectedServerIds, setSelectedServerIds] = useState<number[]>([]);
    const [serverModalOpen, setServerModalOpen] = useState(false);
    const [serverModalRecord, setServerModalRecord] = useState<
        RaRecord | undefined
    >();

    // Copy functionality
    const [copySuccess, setCopySuccess] = useState<string>('');

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(`${type} copied to clipboard!`);
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    const contextValue: AssetManagerContextType = {
        // API Keys
        selectedApiKeyIds,
        setSelectedApiKeyIds,
        apiKeyModalOpen,
        setApiKeyModalOpen,
        apiKeyModalRecord,
        setApiKeyModalRecord,

        // Software Licenses
        selectedSoftwareLicenseIds,
        setSelectedSoftwareLicenseIds,
        softwareLicenseModalOpen,
        setSoftwareLicenseModalOpen,
        softwareLicenseModalRecord,
        setSoftwareLicenseModalRecord,

        // Servers
        selectedServerIds,
        setSelectedServerIds,
        serverModalOpen,
        setServerModalOpen,
        serverModalRecord,
        setServerModalRecord,

        // Copy functionality
        copyToClipboard,
        copySuccess,
        setCopySuccess,
    };

    return (
        <AssetManagerContext.Provider value={contextValue}>
            {children}
        </AssetManagerContext.Provider>
    );
};

export default AssetManagerProvider;
