import React from "react";
import { Pressable, StyleSheet, Text, View, Platform } from "react-native";
import useStore from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EngineButton = () => {
  const startEngine = useStore((state) => state.startEngine);
  const stopEngine = useStore((state) => state.stopEngine);
  const isRunning = useStore((state) => state.subscription !== null);

  const handlePress = () => {
    if (isRunning) {
      stopEngine();
    } else {
      startEngine();
    }
  };

  const activeColor = isRunning ? "#FF0055" : "#00F0FF";

  return (
    <View style={[styles.container, { borderColor: `${activeColor}40` }]}>
      {/* Cyber Corners */}
      <View style={[styles.corner, styles.topLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: activeColor }]} />

      {/* Decorative tech grid lines */}
      <View style={styles.cardGridLines} pointerEvents="none" />

      {/* Decorative high-tech telemetry header */}
      <View style={styles.telemetryHeader}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="gauge" size={10} color={activeColor} style={{ marginRight: 4 }} />
          <Text style={styles.headerText}>// PROPULSION_CORE</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={[styles.pulseDot, { backgroundColor: activeColor, shadowColor: activeColor }]} />
          <Text style={[styles.liveText, { color: activeColor }]}>{isRunning ? "ONLINE" : "STANDBY"}</Text>
        </View>
      </View>

      <Text style={styles.label}>ENGINE STATUS</Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.buttonOuter,
            isRunning ? styles.buttonOuterActive : styles.buttonOuterInactive,
            pressed && styles.buttonPressed,
          ]}
        >
          <View style={[
            styles.buttonMiddle,
            isRunning ? styles.buttonMiddleActive : styles.buttonMiddleInactive
          ]}>
            <View style={[
              styles.buttonInner,
              isRunning ? styles.buttonInnerActive : styles.buttonInnerInactive
            ]}>
              <MaterialCommunityIcons 
                name={isRunning ? "power-plug" : "power"} 
                size={22} 
                color={activeColor} 
              />
              <Text style={[styles.textAction, { color: isRunning ? "#FF0055" : "#FFFFFF" }]}>
                {isRunning ? "SHUTDOWN" : "IGNITE"}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={[
        styles.statusBadge, 
        { 
          backgroundColor: isRunning ? "rgba(255, 0, 85, 0.08)" : "rgba(0, 240, 255, 0.08)", 
          borderColor: activeColor 
        }
      ]}>
        <Text style={[styles.statusText, { color: activeColor }]}>
          {isRunning ? "MONITORING ACTIVE" : "CORE DEACTIVATED"}
        </Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>LINK: <Text style={styles.detailVal}>SECURE</Text></Text>
        <Text style={styles.detailLabel}>BYPASS: <Text style={[styles.detailVal, { color: "#FFE600" }]}>OFF</Text></Text>
      </View>
    </View>
  );
};

export default EngineButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090F",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
    borderWidth: 1,
    elevation: 4,
    flex: 0.85,
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
  telemetryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1b26",
    paddingBottom: 6,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 9,
    color: "#5F758C",
    fontWeight: "800",
    letterSpacing: 1,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  pulseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  liveText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  label: {
    color: "#5F758C",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  buttonContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 6,
  },
  buttonOuterInactive: {
    borderColor: "#00F0FF40",
    backgroundColor: "#030408",
    shadowColor: "#00F0FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonOuterActive: {
    borderColor: "#FF005540",
    backgroundColor: "#030408",
    shadowColor: "#FF0055",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  buttonMiddle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonMiddleInactive: {
    borderColor: "#00F0FF20",
    backgroundColor: "#09090F",
  },
  buttonMiddleActive: {
    borderColor: "#FF005520",
    backgroundColor: "#0f070b",
  },
  buttonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1b26",
  },
  buttonInnerInactive: {
    backgroundColor: "#030408",
  },
  buttonInnerActive: {
    backgroundColor: "#050103",
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  textAction: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  statusBadge: {
    marginTop: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    width: "100%",
  },
  statusText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1a1b26",
  },
  detailLabel: {
    fontSize: 8,
    color: "#5F758C",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  detailVal: {
    color: "#00F0FF",
    fontWeight: "900",
  },
});