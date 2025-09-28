import {
    Organization,
    OrganizationLocation,
    OrganizationServiceContract,
    OrganizationServiceContractItem,
} from '@ci-connect/types';

export const removeNullValues = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj
            .map(item => removeNullValues(item))
            .filter(item => item !== null && item !== undefined);
    }

    if (obj !== null && typeof obj === 'object') {
        const cleanObj: any = {};
        Object.entries(obj).forEach(([key, value]) => {
            // Preserve logoId even if it's null, remove all other null values
            if (key === 'logoId' || (value !== null && value !== undefined)) {
                cleanObj[key] = removeNullValues(value);
            }
        });
        return cleanObj;
    }

    return obj;
};

export const cleanRecord = (data: Organization): any => {
    if (!data) return data;

    if ((data as any).techStacks) {
        (data as any).techStacks = (data as any).techStacks.map((techStack: any) => techStack?.id);
    }

    if (data.trades && data.trades[0] && data.trades[0].id) {
        data.trades = data.trades.map((trade: any) => trade.id);
    }
    if (
        data.organizationLocations &&
        data.organizationLocations[0] &&
        data.organizationLocations[0].id
    ) {
        // remove locationId keep rest of the data
        data.organizationLocations = data?.organizationLocations?.map(
            (location: OrganizationLocation) => {
                const { locationId, ...rest } = location;
                const { cityId, ...locationRest } = location.location;
                return {
                    ...rest,
                    location: locationRest,
                };
            }
        );
    }

    // remove organizationServiceContractId
    if (
        data.organizationServiceContract &&
        data.organizationServiceContract[0] &&
        data.organizationServiceContract[0].id
    ) {
        data.organizationServiceContract = data.organizationServiceContract.map(
            (contract: OrganizationServiceContract) => {
                return {
                    ...contract,
                    items: contract.items.map(
                        (item: OrganizationServiceContractItem) => {
                            const {
                                organizationServiceContractId,
                                ...itemRest
                            } = item;
                            return {
                                ...itemRest,
                            };
                        }
                    ),
                };
            }
        );
    }

    if (Array.isArray(data)) {
        return data.map(item => cleanRecord(item));
    }

    if (typeof data === 'object') {
        const cleaned: any = {};

        for (const [key, value] of Object.entries(data)) {
            // Skip ID-related fields
            if (key === 'organizationId' || key === 'contactId') {
                continue;
            }

            // Recursively clean nested objects and arrays
            if (value && typeof value === 'object') {
                cleaned[key] = cleanRecord(value);
            } else {
                cleaned[key] = value;
            }

            if (Array.isArray(cleaned[key]) && cleaned[key].length === 0) {
                delete cleaned[key];
            }
        }

        return cleaned;
    }

    return data;
};
