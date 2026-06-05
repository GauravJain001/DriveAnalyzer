import EventLogComponent from "@/components/EventLog";
import React from "react";
import { StyleSheet, View, Text, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EventLogScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />

      {/* Decorative Grid Background Overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EventLogComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventLogScreen;

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
  scrollContent: {
    paddingBottom: 24,
  },
});
