import { useCallback, useState } from "react";
import * as Location from "expo-location";

import type { LatLng } from "../data/hazards";

export function useUserLocation() {
    const [granted, setGranted] = useState(false);

    const locate = useCallback(async (): Promise<LatLng | null> => {
        try {
            const { granted: ok } = await Location.requestForegroundPermissionsAsync();
            setGranted(ok);
            if (!ok) return null;
            const { coords } = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            return { latitude: coords.latitude, longitude: coords.longitude };
        } catch {
            return null;
        }
    }, []);

    return { granted, locate };
}
