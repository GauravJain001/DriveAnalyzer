import useStore from "@/store";
import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Score = () => {
  const score = useStore((state) => state.score);

  const getScoreColor = () => {
    if (score >= 80) return "#00F0FF"; // Cyberpunk Cyan
    if (score >= 60) return "#FFE600"; // Cyberpunk Yellow/Gold
    if (score >= 40) return "#FF8C00"; // Caution Orange
    return "#FF0055"; // Cyberpunk Hot Pink/Red
  };

  const getStatusText = () => {
    if (score >= 80) return "SYS_PERF: OPTIMAL";
    if (score >= 60) return "SYS_STAT: NOMINAL";
    if (score >= 40) return "SYS_WARN: EXCEEDED";
    return "SYS_CRIT: FAIL_RISK";
  };

  // Speedometer needle rotation: score is 0 to 100
  // maps from -120deg to 120deg (240 deg sweep)
  const angle = -120 + (score / 100) * 240;

  // Generate 11 dial ticks from 0 to 100 (every 10 points)
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const tickScore = i * 10;
    const tickAngle = -120 + i * 24;
    const isActive = score >= tickScore;
    ticks.push(
      <View
        key={i}
        style={[
          styles.tick,
          {
            transform: [
              { rotate: `${tickAngle}deg` },
              { translateY: -50 },
            ],
            backgroundColor: isActive ? getScoreColor() : "#1a1b26",
            opacity: isActive ? 1 : 0.25,
            width: isActive ? 2 : 1,
            height: isActive ? 8 : 5,
          },
        ]}
      />
    );
  }

  const activeColor = getScoreColor();

  return (
    <View style={[styles.container, { borderColor: `${activeColor}40` }]}>
      {/* Cyber Corners */}
      <View style={[styles.corner, styles.topLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.topRight, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomLeft, { borderColor: activeColor }]} />
      <View style={[styles.corner, styles.bottomRight, { borderColor: activeColor }]} />

      {/* Decorative tech grid lines background */}
      <View style={styles.cardGridLines} pointerEvents="none" />

      {/* Decorative high-tech telemetry header */}
      <View style={styles.telemetryHeader}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="target" size={10} color={activeColor} style={{ marginRight: 4 }} />
          <Text style={styles.headerText}>// HUD_UNIT_01</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={[styles.pulseDot, { backgroundColor: activeColor, shadowColor: activeColor }]} />
          <Text style={[styles.liveText, { color: activeColor }]}>MONITORING</Text>
        </View>
      </View>

      <Text style={styles.label}>SAFETY VELOCITY INDEX</Text>

      {/* Speedometer Gauge Wrapper */}
      <View style={styles.gaugeContainer}>
        {/* Render speedometer scale ticks */}
        {ticks}

        {/* Outer glowing border ring */}
        <View style={[styles.outerRing, { borderColor: activeColor, shadowColor: activeColor }]} />
        <View style={[styles.midRing, { borderColor: `${activeColor}20` }]} />

        {/* Central dial contents */}
        <View style={[styles.innerDial, { borderColor: `${activeColor}40`, shadowColor: activeColor }]}>
          <Text style={styles.scoreUnit}>INDEX</Text>
          <Text style={[styles.scoreNumber, { color: activeColor, textShadowColor: activeColor }]}>{score}</Text>
          <Text style={styles.ptsText}>VAL</Text>
        </View>

        {/* Physical speedometer needle */}
        <View style={[styles.needleContainer, { transform: [{ rotate: `${angle}deg` }] }]}>
          <View style={[styles.needle, { backgroundColor: activeColor, shadowColor: activeColor }]} />
        </View>

        {/* HUD Crosshairs */}
        <View style={[styles.crosshair, styles.crosshairX]} />
        <View style={[styles.crosshair, styles.crosshairY]} />
      </View>

      {/* Dynamic status readout */}
      <View style={[styles.statusBadge, { backgroundColor: `${activeColor}12`, borderColor: activeColor }]}>
        <Text style={[styles.statusText, { color: activeColor }]}>{getStatusText()}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>G-LIMIT: <Text style={styles.detailVal}>1.5G</Text></Text>
        <Text style={styles.detailLabel}>SEN: <Text style={[styles.detailVal, { color: activeColor }]}>ON</Text></Text>
      </View>
    </View>
  );
};

export default Score;

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
    flex: 1.15,
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
  gaugeContainer: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  outerRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderStyle: "dashed",
    opacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  midRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 0.5,
    opacity: 0.3,
  },
  innerDial: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#030408",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  scoreUnit: {
    color: "#5F758C",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: "900",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 28,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  ptsText: {
    color: "#5F758C",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tick: {
    position: "absolute",
    borderRadius: 1,
    top: "50%",
    left: "50%",
    marginTop: -2.5,
    marginLeft: -1,
  },
  needleContainer: {
    position: "absolute",
    width: 4,
    height: 110,
    top: "50%",
    left: "50%",
    marginTop: -55,
    marginLeft: -2,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 2,
  },
  needle: {
    width: 2,
    height: 12,
    borderRadius: 1,
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  crosshair: {
    position: "absolute",
    backgroundColor: "#5F758C",
    opacity: 0.15,
  },
  crosshairX: {
    width: 120,
    height: 0.5,
  },
  crosshairY: {
    width: 0.5,
    height: 120,
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