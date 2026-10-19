import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertsPanel } from "../components/AlertsPanel";
import { HazardMap, type MapHandle } from "../components/HazardMap";
import { SearchBar } from "../components/SearchBar";
import { SAMPLE_HAZARDS } from "../data/hazards";
import { isInNewJersey } from "../data/newJersey";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTheme } from "../theme";

const PANEL_CONTENT_HEIGHT = 260;

export default function MapScreen() {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapHandle>(null);
    const { granted, locate } = useUserLocation();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const panelHeight = PANEL_CONTENT_HEIGHT + insets.bottom;

    // Zoom to the user on launch only if they are in New Jersey; otherwise stay statewide.
    useEffect(() => {
        locate().then((c) => {
            if (c && isInNewJersey(c)) mapRef.current?.flyTo(c, 12);
        });
    }, [locate]);

    const selectHazard = useCallback((id: string) => {
        setSelectedId(id);
        const hazard = SAMPLE_HAZARDS.find((h) => h.id === id);
        if (hazard) mapRef.current?.flyTo(hazard.coordinates, 14);
    }, []);

    const goToMyLocation = useCallback(async () => {
        const c = await locate();
        if (c) mapRef.current?.flyTo(c, 14);
        else Alert.alert("Location unavailable", "Enable location access in Settings to center the map on you.");
    }, [locate]);

    const search = useCallback(async () => {
        const text = query.trim();
        if (!text) return;
        setSearching(true);
        setSearchError(null);
        try {
            const [match] = await Location.geocodeAsync(`${text}, New Jersey`);
            if (match) mapRef.current?.flyTo({ latitude: match.latitude, longitude: match.longitude }, 13);
            else setSearchError("No results in New Jersey");
        } catch {
            setSearchError("Search failed. Check your connection and location permission.");
        } finally {
            setSearching(false);
        }
    }, [query]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <HazardMap
                ref={mapRef}
                hazards={SAMPLE_HAZARDS}
                showUserLocation={granted}
                bottomInset={panelHeight}
                onSelectHazard={selectHazard}
            />

            <View style={[styles.top, { top: insets.top + 8 }]}>
                <SearchBar value={query} onChangeText={setQuery} onSubmit={search} loading={searching} />
                {searchError && (
                    <Text style={[styles.error, { backgroundColor: colors.surface, color: colors.textMuted }]}>
                        {searchError}
                    </Text>
                )}
            </View>

            <Pressable
                accessibilityLabel="Center map on my location"
                onPress={goToMyLocation}
                style={[styles.locate, { bottom: panelHeight + 16, backgroundColor: colors.surface, borderColor: colors.border }]}
            >
                <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.primary} />
            </Pressable>

            <AlertsPanel
                hazards={SAMPLE_HAZARDS}
                selectedId={selectedId}
                height={panelHeight}
                bottomPadding={insets.bottom}
                onSelect={selectHazard}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    top: { position: "absolute", left: 16, right: 16 },
    error: { alignSelf: "flex-start", marginTop: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, overflow: "hidden", fontSize: 13 },
    locate: {
        position: "absolute",
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
});
