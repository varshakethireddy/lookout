import { AppleMaps, GoogleMaps } from "expo-maps";
import { Ref, useImperativeHandle, useMemo, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { HAZARD_META, type Hazard, type LatLng } from "../data/hazards";
import { NJ_CENTER, NJ_ZOOM } from "../data/newJersey";
import { useTheme } from "../theme";

export type MapHandle = {
    flyTo: (coordinates: LatLng, zoom?: number) => void;
};

type Props = {
    ref?: Ref<MapHandle>;
    hazards: Hazard[];
    showUserLocation: boolean;
    bottomInset: number;
    onSelectHazard: (id: string) => void;
};

const INITIAL_CAMERA = { coordinates: NJ_CENTER, zoom: NJ_ZOOM };

export function HazardMap({ ref, hazards, showUserLocation, bottomInset, onSelectHazard }: Props) {
    const { isDark, colors } = useTheme();
    const appleRef = useRef<AppleMaps.MapView>(null);
    const googleRef = useRef<GoogleMaps.MapView>(null);

    useImperativeHandle(ref, () => ({
        flyTo: (coordinates, zoom = 13) => {
            appleRef.current?.setCameraPosition({ coordinates, zoom });
            googleRef.current?.setCameraPosition({ coordinates, zoom, duration: 600 });
        },
    }));

    const appleMarkers = useMemo<AppleMaps.Marker[]>(
        () =>
            hazards.map((h) => ({
                id: h.id,
                coordinates: h.coordinates,
                title: HAZARD_META[h.type].label,
                systemImage: HAZARD_META[h.type].sfSymbol,
                tintColor: HAZARD_META[h.type].color,
            })),
        [hazards],
    );

    const googleMarkers = useMemo<GoogleMaps.Marker[]>(
        () =>
            hazards.map((h) => ({
                id: h.id,
                coordinates: h.coordinates,
                title: HAZARD_META[h.type].label,
                snippet: h.location,
            })),
        [hazards],
    );

    if (Platform.OS === "ios") {
        return (
            <AppleMaps.View
                ref={appleRef}
                style={StyleSheet.absoluteFill}
                cameraPosition={INITIAL_CAMERA}
                colorScheme={isDark ? AppleMaps.MapColorScheme.DARK : AppleMaps.MapColorScheme.LIGHT}
                markers={appleMarkers}
                onMarkerClick={(m) => m.id && onSelectHazard(m.id)}
                properties={{ isMyLocationEnabled: showUserLocation }}
                uiSettings={{ myLocationButtonEnabled: false, compassEnabled: true }}
            />
        );
    }

    if (Platform.OS === "android") {
        return (
            <GoogleMaps.View
                ref={googleRef}
                style={StyleSheet.absoluteFill}
                cameraPosition={INITIAL_CAMERA}
                colorScheme={isDark ? GoogleMaps.MapColorScheme.DARK : GoogleMaps.MapColorScheme.LIGHT}
                contentPadding={{ bottom: bottomInset }}
                markers={googleMarkers}
                onMarkerClick={(m) => m.id && onSelectHazard(m.id)}
                properties={{ isMyLocationEnabled: showUserLocation }}
                uiSettings={{
                    myLocationButtonEnabled: false,
                    zoomControlsEnabled: false,
                    mapToolbarEnabled: false,
                }}
            />
        );
    }

    return (
        <View style={[StyleSheet.absoluteFill, styles.unsupported, { backgroundColor: colors.surfaceMuted }]}>
            <Text style={{ color: colors.textMuted }}>The map is only available on iOS and Android.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    unsupported: { alignItems: "center", justifyContent: "center" },
});
