import Score from "@/components/Score";
import StartButton from "@/components/EngineButton";
import EventStats from "@/components/EventStats";

import React from "react";
import { ScrollView, StyleSheet, View, Text, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useStore from "@/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = () => {
  const isRunning = useStore((state) => state.subscription !== null);
  const data = useStore((state) => state.data);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020308" />
      
      {/* Decorative Grid Lines Background Overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />
      <View style={styles.scanLine} pointerEvents="none" />

      <ScrollView contentContainerStyle={styles.contentContainer} bounces={false}>
        <View style={styles.dashboardRow}>
          <Score />
          <StartButton />
        </View>
        
        {/* Real-time Telemetry Vector Stream */}
        <View style={[styles.streamContainer, { borderColor: isRunning ? "#FF005540" : "#00F0FF30" }]}>
          {/* Cyber Corners */}
          <View style={[styles.corner, styles.topLeft, { borderColor: isRunning ? "#FF0055" : "#00F0FF" }]} />
          <View style={[styles.corner, styles.topRight, { borderColor: isRunning ? "#FF0055" : "#00F0FF" }]} />
          <View style={[styles.corner, styles.bottomLeft, { borderColor: isRunning ? "#FF0055" : "#00F0FF" }]} />
          <View style={[styles.corner, styles.bottomRight, { borderColor: isRunning ? "#FF0055" : "#00F0FF" }]} />
          
          <View style={styles.streamHeader}>
            <MaterialCommunityIcons 
              name="transmission-tower" 
              size={12} 
              color={isRunning ? "#FF0055" : "#00F0FF"} 
              style={{ marginRight: 6 }} 
            />
            <Text style={[styles.streamHeaderText, { color: isRunning ? "#FF0055" : "#00F0FF" }]}>
              {isRunning ? "// REALTIME_DATALOG_STREAM" : "// REALTIME_DATALOG_OFFLINE"}
            </Text>
          </View>

          {isRunning && data ? (
            <View style={styles.streamGrid}>
              <View style={styles.streamCol}>
                <Text style={styles.streamLabel}>ACC_X: <Text style={styles.streamValue}>{data.acceleration?.x?.toFixed(4) ?? "0.0000"}</Text></Text>
                <Text style={styles.streamLabel}>ACC_Y: <Text style={styles.streamValue}>{data.acceleration?.y?.toFixed(4) ?? "0.0000"}</Text></Text>
                <Text style={styles.streamLabel}>ACC_Z: <Text style={styles.streamValue}>{data.acceleration?.z?.toFixed(4) ?? "0.0000"}</Text></Text>
              </View>
              <View style={styles.streamCol}>
                <Text style={styles.streamLabel}>ROT_A: <Text style={styles.streamValue}>{data.rotationRate?.alpha?.toFixed(4) ?? "0.0000"}</Text></Text>
                <Text style={styles.streamLabel}>ROT_B: <Text style={styles.streamValue}>{data.rotationRate?.beta?.toFixed(4) ?? "0.0000"}</Text></Text>
                <Text style={styles.streamLabel}>ROT_G: <Text style={styles.streamValue}>{data.rotationRate?.gamma?.toFixed(4) ?? "0.0000"}</Text></Text>
              </View>
            </View>
          ) : (
            <View style={styles.streamOfflineContent}>
              <Text style={styles.streamOfflineText}>
                [ STANDBY: PRESS IGNITION ON REACTOR CORE ]
              </Text>
            </View>
          )}
        </View>

        <EventStats />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020308",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: "#00F0FF",
  },
  scanLine: {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#00F0FF",
    opacity: 0.04,
  },
  contentContainer: {
    paddingVertical: 12,
  },
  dashboardRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "stretch",
  },
  streamContainer: {
    backgroundColor: "#09090F",
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  streamHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#1a1b26",
    paddingBottom: 6,
    marginBottom: 8,
  },
  streamHeaderText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  streamGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  streamCol: {
    width: "48%",
  },
  streamLabel: {
    fontSize: 8,
    color: "#4F5A6B",
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  streamValue: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  streamOfflineContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  streamOfflineText: {
    fontSize: 8,
    color: "#FFE600",
    fontWeight: "900",
    letterSpacing: 0.8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
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
});