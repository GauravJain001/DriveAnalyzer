import React from "react";
import { StyleSheet, View, Text, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020308" />
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Tech corner accents */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name={"chart-areaspline-variant" as any} size={48} color="#00F0FF" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>[ ANALYTICS OFFLINE ]</Text>
        <Text style={styles.emptySubtitle}>THE SENSOR ACQUISITION DATABASE IS CURRENTLY IN STANDBY.</Text>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020308",
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: "#00F0FF",
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "#00F0FF20",
  },
  topLeft: {
    top: 40,
    left: 20,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  topRight: {
    top: 40,
    right: 20,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  bottomLeft: {
    bottom: 40,
    left: 20,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  bottomRight: {
    bottom: 40,
    right: 20,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  emptyIcon: {
    textShadowColor: "#00F0FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#00F0FF",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  emptySubtitle: {
    color: "#5F758C",
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 14,
  },
});