export interface APIKey {
    id: number;
    name: string;
    description?: string;
    owner: string;
    key: string;
    url?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SoftwareLicense {
    id: number;
    name: string;
    description?: string;
    owner: string;
    key: string;
    url?: string;
    cost?: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Server {
    id: number;
    ips: string[];
    hostname: string;
    tags: string[];
    hostingProviderId: number;
    cost?: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    domains?: any[];
    hostingProvider?: any;
}

export interface AssetDashboardStats {
    totalApiKeys: number;
    activeApiKeys: number;
    totalSoftwareLicenses: number;
    activeSoftwareLicenses: number;
    totalServers: number;
    activeServers: number;
    totalCost: number;
    recentAssets: (APIKey | SoftwareLicense | Server)[];
}

export type AssetType = 'api-key' | 'software-license' | 'server';

export interface CopyableFieldProps {
    value: string;
    type: string;
    copyToClipboard: (text: string, type: string) => void;
}
