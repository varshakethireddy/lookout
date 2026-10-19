import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "../theme";

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    loading: boolean;
};

export function SearchBar({ value, onChangeText, onSubmit, loading }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.bar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                placeholder="Search New Jersey"
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                autoCorrect={false}
                style={[styles.input, { color: colors.text }]}
            />
            {loading && <Text style={{ color: colors.textMuted }}>...</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: 48,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    input: { flex: 1, fontSize: 16 },
});
