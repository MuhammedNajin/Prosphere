


interface ParsedPlace {
    name: string;
    area: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
    id: string;
}

export function parsePlaceData(mapboxResult: MapboxResult): ParsedPlace {

    const components = mapboxResult.place_name.split(', ');
    
    return {
        name: components[0],
        area: components[1], 
        city: components[2], 
        state: components[3], 
        postalCode: components[4].split(' ')[0], 
        country: components[4].split(' ')[1],
        coordinates: {
            longitude: mapboxResult.coordinates[0],
            latitude: mapboxResult.coordinates[1]
        },
        id: mapboxResult.id
    };
}
