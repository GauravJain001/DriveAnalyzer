import { StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import useStore, { Events } from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EventLog = () => {
  const eventHistory = useStore((state) => state.eventHistory);

  const getEventMeta = (event: Events) => {
    switch (event) {
      case "HarshBreaking":
        return { label: "HARSH BRAKING DETECTED", penalty: "-5 PTS", color: "#FFE600", icon: "car-brake-alert" };
      case "HarshAcceleration":
        return { label: "HARSH ACCEL DETECTED", penalty: "-5 PTS", color: "#FFE600", icon: "speedometer" };
      case "SharpTurn":
        return { label: "SHARP TURN DETECTED", penalty: "-4 PTS", color: "#00F0FF", icon: "navigation-variant" };
      case "AggressiveSteeringMovement":
        return { label: "AGGRESSIVE STEER DETECTED", penalty: "-6 PTS", color: "#FF0055", icon: "steering" };
      case "ExcessiveDeviceMovement":
        return { label: "DEVICE SHAKING DETECTED", penalty: "-3 PTS", color: "#00F0FF", icon: "vibrate" };
      case "PhoneUseDuringDriving":
        return { label: "PHONE USE DETECTED", penalty: "-10 PTS", color: "#FF0055", icon: "cellphone-remove" };
      default:
        return { label: "ANOMALY FLAG", penalty: "-0 PTS", color: "#00F0FF", icon: "alert-circle" };
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const hrs = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    const secs = d.getSeconds().toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Display latest events first
  const sortedHistory = [...eventHistory].reverse();
  const activeColor = "#00F0FF";

  return (
    <View style={[styles.container, { borderColor: `${activeColor}30` }]}>
      {/* Cyber Corners */}
      <View style={[styles.corner, styles.topLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: activeColor }]} />

      {/* Decorative tech grid lines */}
      <View style={styles.cardGridLines} pointerEvents="none" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="console" size={14} color={activeColor} style={{ marginRight: 6 }} />
          <Text style={styles.title}>// LIVE_SYSTEM_LOGS</Text>
        </View>
        <Text style={styles.packetCount}>
          PACKETS: {eventHistory.length.toString().padStart(3, "0")}
        </Text>
      </View>

      {eventHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="shield-check" size={32} color="#00FF66" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>[ SYSTEM_STATUS: NOMINAL ]</Text>
          <Text style={styles.emptySubtext}>NO VEHICLE DRIVE ANOMALIES RECORDED</Text>
        </View>
      ) : (
        <View style={styles.logList}>
          {sortedHistory.map((item, index) => {
            const meta = getEventMeta(item.event);
            return (
              <View key={index} style={[styles.logRow, { borderColor: `${meta.color}30`, borderLeftColor: meta.color }]}>
                {/* Micro corner highlight */}
                <View style={[styles.rowCorner, { borderTopColor: meta.color, borderRightColor: meta.color }]} />

                <View style={styles.logLeft}>
                  <View style={styles.rowMeta}>
                    <Text style={styles.timestamp}>[{formatTime(item.timestamp)}]</Text>
                    <MaterialCommunityIcons name={meta.icon as any} size={10} color={meta.color} style={{ marginLeft: 6 }} />
                  </View>
                  <Text style={[styles.eventLabel, { color: "#FFFFFF" }]}>
                    {meta.label}
                  </Text>
                </View>
                <View style={[styles.penaltyBadge, { backgroundColor: `${meta.color}12`, borderColor: meta.color }]}>
                  <Text style={[styles.penaltyText, { color: meta.color }]}>
                    {meta.penalty}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default EventLog;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090F",
    borderRadius: 8,
    padding: 14,
    margin: 16,
    borderWidth: 1,
    minHeight: 180,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1b26",
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#5F758C",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  packetCount: {
    color: "#00F0FF",
    fontSize: 8,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 10,
    textShadowColor: "#00FF66",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  emptyText: {
    color: "#00FF66",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  emptySubtext: {
    color: "#4F5A6B",
    fontSize: 8,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  logList: {
    // grows dynamically to fit outer scrolls naturally
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#030408",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderWidth: 1,
    position: "relative",
  },
  rowCorner: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  logLeft: {
    flex: 1,
    flexDirection: "column",
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timestamp: {
    color: "#5F758C",
    fontSize: 8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "700",
  },
  eventLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  penaltyBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1,
  },
  penaltyText: {
    fontSize: 8,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});