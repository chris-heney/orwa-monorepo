export interface PlatformGroup {
    id: number;
    key: string;
    icon?: string;
    title: string;
    purpose: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    platforms: Platform[];
}

export interface Platform {
    id: number;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    platformGroupId: number;
    platformGroup: PlatformGroup;
    organization: any[]; // Can be typed more specifically if needed
}
