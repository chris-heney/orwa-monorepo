import { OrganizationServiceContract, OrganizationServiceContractItem } from "@ci-connect/types";

interface TotalsResult {
    setup: number;
    monthly: number;
    annual: number;
    addonSetup: number;
    addonMonthly: number;
    addonAnnual: number;
    featureSetup: number;
    featureMonthly: number;
    featureAnnual: number;
}

export const calculateTotals = (
    serviceContract: OrganizationServiceContract | undefined,
    filterByServiceName?: string
): TotalsResult => {
    // Default empty result
    const emptyResult: TotalsResult = {
        setup: 0,
        monthly: 0,
        annual: 0,
        addonSetup: 0,
        addonMonthly: 0,
        addonAnnual: 0,
        featureSetup: 0,
        featureMonthly: 0,
        featureAnnual: 0,
    };

    // Check if we have valid data
    if (!serviceContract?.items || !Array.isArray(serviceContract?.items)) {
        return emptyResult;
    }

    // Filter items by serviceName if provided
    const items = filterByServiceName
        ? serviceContract.items.filter(
              item => item.coreServiceName === filterByServiceName
          )
        : serviceContract.items;

    // Initialize result with empty values
    const result = { ...emptyResult };

    // Process each item
    items.forEach((item: OrganizationServiceContractItem) => {
        const quantity = Number(item.quantity) || 1;
        const setupCost = Number(item.investmentSetup) || 0;
        const recurringCost = Number(item.investmentRecurring) || 0;
        const perUnitCost = Number(item.investmentEa) || 0;

        // Calculate setup cost (one-time)
        const totalSetupCost = setupCost * quantity;

        // Calculate recurring costs based on frequency
        let monthlyRecurring = 0;
        let annualRecurring = 0;

        if (item.frequency === 'MONTHLY') {
            monthlyRecurring = recurringCost * quantity;
        } else if (item.frequency === 'ANNUALLY') {
            annualRecurring = recurringCost + perUnitCost * quantity;
        }

        // Add to appropriate category based on item type
        switch (item.type) {
            case 'PACKAGE':
                result.setup += totalSetupCost;
                result.monthly += monthlyRecurring;
                result.annual += annualRecurring;
                break;

            case 'ADDON':
                result.addonSetup += totalSetupCost + perUnitCost * quantity;
                result.addonMonthly += monthlyRecurring;
                result.addonAnnual += annualRecurring;
                // Also add to totals
                result.setup += totalSetupCost;
                result.monthly += monthlyRecurring;
                result.annual += annualRecurring;
                break;

            case 'FEATURE':
                result.featureSetup += totalSetupCost;
                result.featureMonthly += monthlyRecurring;
                result.featureAnnual += annualRecurring;
                // Also add to totals
                result.setup += totalSetupCost;
                result.monthly += monthlyRecurring;
                result.annual += annualRecurring;
                break;
        }
    });

    return result;
};
