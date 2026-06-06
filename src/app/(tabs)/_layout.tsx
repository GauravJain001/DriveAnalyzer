import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform } from "react-native";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#05050A",
          borderTopWidth: 1.5,
          borderTopColor: "#FF005530", // Cyberpunk glowing neon pink border
          paddingTop: 6,
          elevation: 10,
          shadowColor: "#00F0FF",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: "#00F0FF", // Neon Cyan
        tabBarInactiveTintColor: "#4F5A6B", // Muted Steel
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "900",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HUD Core",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="crosshairs-gps" size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="eventlog"
        options={{
          title: "Alert Log",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={"alert-octagon-outline" as any} size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={"chart-areaspline-variant" as any} size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

