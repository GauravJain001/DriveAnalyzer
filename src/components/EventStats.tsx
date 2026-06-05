import { StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import useStore from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type MCOIconType = keyof typeof MaterialCommunityIcons.glyphMap;

const EventStats = () => {
  const eventStats = useStore((state) => state.eventStats);

  const stats: {
    label: string;
    value: number;
    icon: MCOIconType;
    severity: "low" | "medium" | "high";
  }[] = [
    { 
      label: "Harsh Braking", 
      value: eventStats.HarshBreaking, 
      icon: "car-brake-alert",
      severity: "medium"
    },
    { 
      label: "Harsh Acceleration", 
      value: eventStats.HarshAcceleration, 
      icon: "speedometer",
      severity: "medium"
    },
    { 
      label: "Sharp Turn", 
      value: eventStats.SharpTurn, 
      icon: "navigation-variant",
      severity: "low"
    },
    {
      label: "Aggressive Steering",
      value: eventStats.AggressiveSteeringMovement,
      icon: "steering",
      severity: "high"
    },
    {
      label: "Device Movement",
      value: eventStats.ExcessiveDeviceMovement,
      icon: "vibrate",
      severity: "low"
    },
    {
      label: "Phone Usage",
      value: eventStats.PhoneUseDuringDriving,
      icon: "cellphone-remove",
      severity: "high"
    },
  ];

  const getAlertColor = (value: number, severity: "low" | "medium" | "high") => {
    if (value === 0) return "#4F5A6B"; // Muted offline steel
    if (severity === "high") return "#FF0055"; // Cyber Punk Hot Pink/Red
    if (severity === "medium") return "#FFE600"; // Cyber Punk Yellow/Gold
    return "#00F0FF"; // Cyber Punk Cyan
  };

  const activeColor = "#00F0FF"; // Cyan accent for the header/box itself

  return (
    <View style={[styles.container, { borderColor: `${activeColor}30` }]}>
      {/* Cyber Corners */}
      <View style={[styles.corner, styles.topLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: activeColor }]} />

      {/* Decorative tech grid lines */}
      <View style={styles.cardGridLines} pointerEvents="none" />

      <Text style={styles.title}>// DIAGNOSTICS_MATRIX_SYS</Text>

      <View style={styles.grid}>
        {stats.map((item) => {
          const isTripped = item.value > 0;
          const color = getAlertColor(item.value, item.severity);

          return (
            <View key={item.label} style={[
              styles.cell, 
              isTripped ? { backgroundColor: "#0f070b", borderColor: color } : styles.cellNormal,
            ]}>
              {/* Corner clip ornament on tripped cells */}
              {isTripped && (
                <View style={[styles.cellCorner, { borderTopColor: color, borderRightColor: color }]} />
              )}

              <View style={styles.cellHeader}>
                <MaterialCommunityIcons name={item.icon} size={16} color={color} style={styles.cellIcon} />
                <View style={[
                  styles.badge, 
                  { 
                    backgroundColor: isTripped ? `${color}15` : "#030408", 
                    borderColor: isTripped ? color : "#1a1b26" 
                  }
                ]}>
                  <Text style={[styles.value, { color: color }]}>
                    {String(item.value).padStart(2, "0")}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.label, isTripped && { color: "#FFFFFF" }]} numberOfLines={1}>
                {item.label.toUpperCase()}
              </Text>
              
              <Text style={[styles.cellStatus, { color: isTripped ? color : "#4F5A6B" }]}>
                {isTripped ? `[ TRIPPED_${item.severity.toUpperCase()} ]` : "[ NOMINAL ]"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default EventStats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090F",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  cardGridLines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: "#00F0FF",
  },
  corner: {
    position: "absolute",
    width: 8,
    height: 8,
    borderWidth: 0,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  topRight: {
    top: -1,
    right: -1,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  title: {
    color: "#5F758C",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 10,
    paddingLeft: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cell: {
    width: "48%",
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    position: "relative",
  },
  cellNormal: {
    backgroundColor: "#030408",
    borderColor: "#1a1b26",
  },
  cellCorner: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  cellHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cellIcon: {
    opacity: 0.9,
  },
  label: {
    color: "#4F5A6B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.6,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  cellStatus: {
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  badge: {
    minWidth: 22,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  value: {
    fontSize: 9,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});