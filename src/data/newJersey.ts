import type { LatLng } from "./hazards";

export const NJ_CENTER: LatLng = { latitude: 40.1, longitude: -74.55 };
export const NJ_ZOOM = 7.5;

const NJ_BOUNDS = { south: 38.9, north: 41.4, west: -75.6, east: -73.85 };

export function isInNewJersey({ latitude, longitude }: LatLng): boolean {
    return (
        latitude >= NJ_BOUNDS.south &&
        latitude <= NJ_BOUNDS.north &&
        longitude >= NJ_BOUNDS.west &&
        longitude <= NJ_BOUNDS.east
    );
}
