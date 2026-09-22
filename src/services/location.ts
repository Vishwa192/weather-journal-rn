import * as Location from 'expo-location'

export interface Coordinates{
    latitude: number,
    longitude: number,
}

export async function getCurrentCoordinates(): Promise<Coordinates> {
    const {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
        throw new Error('Location Permission not granted');
    }

    const location = await Location.getCurrentPositionAsync({});
    return{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
}