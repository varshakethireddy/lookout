import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type LatLng = { latitude: number; longitude: number };

export type HazardType =
    | "flooding"
    | "fallen_tree"
    | "road_closure"
    | "power_outage"
    | "accident"
    | "other";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const HAZARD_META: Record<
    HazardType,
    { label: string; color: string; icon: IconName; sfSymbol: string }
> = {
    flooding: { label: "Flooding", color: "#3B82F6", icon: "water", sfSymbol: "drop.fill" },
    fallen_tree: { label: "Fallen Tree", color: "#22A06B", icon: "tree", sfSymbol: "tree.fill" },
    road_closure: { label: "Road Closure", color: "#EF4444", icon: "cone", sfSymbol: "nosign" },
    power_outage: { label: "Power Outage", color: "#F59E0B", icon: "flash", sfSymbol: "bolt.fill" },
    accident: { label: "Accident", color: "#F97316", icon: "car-emergency", sfSymbol: "car.fill" },
    other: { label: "Other", color: "#64748B", icon: "dots-horizontal", sfSymbol: "ellipsis" },
};

export type Hazard = {
    id: string;
    type: HazardType;
    location: string;
    coordinates: LatLng;
    reportedAt: number;
    reportCount: number;
};

const minutesAgo = (m: number) => Date.now() - m * 60_000;

// Placeholder data until reports come from a backend.
export const SAMPLE_HAZARDS: Hazard[] = [
    { id: "h1", type: "flooding", location: "Washington Rd near Community Park, Princeton", coordinates: { latitude: 40.3487, longitude: -74.6593 }, reportedAt: minutesAgo(20), reportCount: 12 },
    { id: "h2", type: "fallen_tree", location: "Maple Ave, Maplewood", coordinates: { latitude: 40.7312, longitude: -74.2733 }, reportedAt: minutesAgo(60), reportCount: 5 },
    { id: "h3", type: "road_closure", location: "Cherry Hill Rd, Princeton", coordinates: { latitude: 40.3702, longitude: -74.6381 }, reportedAt: minutesAgo(120), reportCount: 8 },
    { id: "h4", type: "power_outage", location: "Downtown Newark", coordinates: { latitude: 40.7357, longitude: -74.1724 }, reportedAt: minutesAgo(180), reportCount: 23 },
    { id: "h5", type: "accident", location: "Route 1 near Trenton", coordinates: { latitude: 40.2206, longitude: -74.7597 }, reportedAt: minutesAgo(35), reportCount: 4 },
    { id: "h6", type: "flooding", location: "Pacific Ave, Atlantic City", coordinates: { latitude: 39.3643, longitude: -74.4229 }, reportedAt: minutesAgo(90), reportCount: 9 },
    { id: "h7", type: "fallen_tree", location: "Route 70, Toms River", coordinates: { latitude: 39.9537, longitude: -74.1979 }, reportedAt: minutesAgo(240), reportCount: 3 },
    { id: "h8", type: "other", location: "Observer Hwy, Hoboken", coordinates: { latitude: 40.7439, longitude: -74.0324 }, reportedAt: minutesAgo(15), reportCount: 2 },
];

export function formatAge(timestamp: number): string {
    const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60_000));
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}
