import React from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Simulation = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      <View style={styles.gridOverlay} pointerEvents="none" />

      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={48} color="#5F758C" />
        <Text style={styles.emptyText}>SIMULATOR READY</Text>
        <Text style={styles.emptySubtitle}>TEST TRACK CHANNELS INACTIVE. CALIBRATION OFFLINE.</Text>
      </View>
    </SafeAreaView>
  );
};

export default Simulation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030712",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    borderWidth: 1,
    borderColor: "#00D2FF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: "#5F758C",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});