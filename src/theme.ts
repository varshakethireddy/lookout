import { useColorScheme } from "react-native";

export type Colors = {
    background: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    border: string;
    primary: string;
    onPrimary: string;
};

const light: Colors = {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F1F4F9",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
    primary: "#2F80FF",
    onPrimary: "#FFFFFF",
};

const dark: Colors = {
    background: "#0B0C14",
    surface: "#14151F",
    surfaceMuted: "#1F2130",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "#2A2C3D",
    primary: "#7C5CFC",
    onPrimary: "#FFFFFF",
};

export function useTheme() {
    const isDark = useColorScheme() === "dark";
    return { isDark, colors: isDark ? dark : light };
}
