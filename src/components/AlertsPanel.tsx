import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { formatAge, HAZARD_META, type Hazard } from "../data/hazards";
import { useTheme } from "../theme";

type Props = {
    hazards: Hazard[];
    selectedId: string | null;
    height: number;
    bottomPadding: number;
    onSelect: (id: string) => void;
};

export function AlertsPanel({ hazards, selectedId, height, bottomPadding, onSelect }: Props) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.panel,
                { height, paddingBottom: bottomPadding, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <Text style={[styles.title, { color: colors.text }]}>Recent Alerts</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {hazards.map((h) => {
                    const meta = HAZARD_META[h.type];
                    const selected = h.id === selectedId;
                    return (
                        <Pressable
                            key={h.id}
                            onPress={() => onSelect(h.id)}
                            style={[styles.row, selected && { backgroundColor: colors.surfaceMuted }]}
                        >
                            <View style={[styles.icon, { backgroundColor: meta.color }]}>
                                <MaterialCommunityIcons name={meta.icon} size={20} color="#FFFFFF" />
                            </View>
                            <View style={styles.rowText}>
                                <Text style={[styles.rowTitle, { color: colors.text }]}>{meta.label}</Text>
                                <Text numberOfLines={1} style={{ color: colors.textMuted }}>
                                    {h.location}
                                </Text>
                            </View>
                            <View style={styles.rowMeta}>
                                <Text style={[styles.age, { color: colors.textMuted }]}>{formatAge(h.reportedAt)}</Text>
                                <Text style={[styles.count, { color: colors.primary }]}>{h.reportCount} reports</Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
        elevation: 12,
    },
    handle: { alignSelf: "center", width: 36, height: 4, borderRadius: 2, marginBottom: 12 },
    title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12 },
    icon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    rowText: { flex: 1 },
    rowTitle: { fontSize: 15, fontWeight: "600" },
    rowMeta: { alignItems: "flex-end" },
    age: { fontSize: 12 },
    count: { fontSize: 12, fontWeight: "600", marginTop: 2 },
});
