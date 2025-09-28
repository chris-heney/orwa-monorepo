export interface FeatureRecord {
    id: number;
    name: string;
    investmentSetup?: number;
    investmentRecurring?: number;
    investmentEa?: number;
    quantity?: number;
    min?: number;
    max?: number;
    investmentFrequency?: string;
};
