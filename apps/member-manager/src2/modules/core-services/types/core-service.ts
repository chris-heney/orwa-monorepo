export type InvestmentFrequency = 'MONTHLY' | 'YEARLY' | 'ONE_TIME';

export interface CoreService {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    features: Feature[];
    packages: Package[];
    packageGroups: PackageGroup[];
}

export interface Feature {
    id: number;
    name: string;
    description: string;
    coreServiceId: number;
    investmentSetup: number;
    investmentRecurring: number;
    investmentEa: number;
    quantity: number;
    min: number;
    max: number;
    investmentFrequency: InvestmentFrequency;
    addon: boolean;
    createdAt: string;
    updatedAt: string;
    coreService: CoreService;
    PackageFeature: any[]; // Can be typed more specifically if needed
    PackageGroupFeature: any[]; // Can be typed more specifically if needed
}

export interface Package {
    id: number;
    name: string;
    description: string;
    coreServiceId: number;
    packageGroupId: number | null;
    investmentSetup: number;
    investmentRecurring: number;
    investmentFrequency: InvestmentFrequency;
    organizationEngagementId: number | null;
    coreService: CoreService;
    packageGroup: PackageGroup | null;
    PackageFeature: any[]; // Can be typed more specifically if needed
}

export interface PackageGroup {
    id: number;
    name: string;
    description: string;
    revenueMin: number;
    revenueMax: number;
    createdAt: string;
    updatedAt: string;
    packages: Package[];
    PackageGroupFeature: any[]; // Can be typed more specifically if needed
    coreServices: CoreService[];
} 