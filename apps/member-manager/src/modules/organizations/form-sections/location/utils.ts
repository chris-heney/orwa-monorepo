import { RaRecord } from 'react-admin';
import { FieldValues } from 'react-hook-form';

// to city object add id: data.cityId

export const transform = (data: FieldValues, record?: RaRecord) => {
    console.log('data', data);
    // Ensure city data is properly structured
    const city = {
        id: data.cityId,
        name: data.city.name,
        state: data.city.state,
        latitude: data.city.latitude,
        longitude: data.city.longitude,
    };

    return {
        id: data.id,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        organizationLocations: {
            organizationId: record?.id,
        },
        city,
    };
};
