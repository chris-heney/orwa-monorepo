export interface ServiceContext {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    organizationServices: any[]; // We'll type this properly when needed
    locationExclusions: any[];   // We'll type this properly when needed
    trades: Trade[];
    services: Service[];
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    organizationServices: any[]; // We'll type this properly when needed
    locationExclusions: any[];   // We'll type this properly when needed
    serviceContexts: ServiceContext[];
}

export interface Industry {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    organizations: any[];  // We'll type this properly when needed
    trades: Trade[];
}

export interface Trade {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    industries: Industry[];
    organizations: any[];  // We'll type this properly when needed
    serviceContexts: ServiceContext[];
    locationExclusions: any[];  // We'll type this properly when needed
}

// Form interfaces for create/edit operations
export interface ServiceContextFormData {
    name: string;
    description?: string;
    tradeIds: number[];
    serviceIds: number[];
}

export interface ServiceFormData {
    name: string;
    description?: string;
    serviceContextIds: number[];
}

export interface IndustryFormData {
    name: string;
    description?: string;
    tradeIds: number[];
}

export interface TradeFormData {
    name: string;
    description?: string;
    industryIds: number[];
    serviceContextIds: number[];
}