import { StyleSheet, Text, View, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from "@expo/vector-icons"

const SplashScreen = () => {
  const router = useRouter()
  useEffect(()=>{
    const route = ()=>{
    
      router.replace("/(tabs)/home" as any)
    }
    setTimeout(()=>{route()},5000)
  },[])
  return (
    <View style={styles.container}>
      {/* Tech corner accents */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* Decorative background grid and HUD circles */}
      <View style={styles.gridOverlay} pointerEvents="none" />
      <View style={styles.hudCircle} pointerEvents="none" />
      <View style={styles.hudCircleInner} pointerEvents="none" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="steering" size={48} color="#00F0FF" style={styles.icon} />
          <Text style={styles.title}>DRIVE <Text style={{ color: "#00F0FF" }}>[ANALYZER]</Text></Text>
          <Text style={styles.subtitle}>SYS_LOAD_V1.2.0</Text>
        </View>

        {/* Cyberpunk Loading bar */}
        <View style={styles.loaderBox}>
          <Text style={styles.loaderText}>[ LOADING CORE TELEMETRY DATABASE... ]</Text>
          <ActivityIndicator size="small" color="#FF0055" style={styles.spinner} />
        </View>

        {/* Tech meta readouts at the bottom */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SYS_SECURE_LINK: ONLINE</Text>
          <Text style={styles.footerText}>MEM_ALLOCATION: OK</Text>
        </View>
      </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020308", // Obsidian void
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: "#00F0FF",
  },
  hudCircle: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "#00F0FF20",
    borderStyle: "dashed",
  },
  hudCircleInner: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: "#FF005510",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#00F0FF",
  },
  topLeft: {
    top: 40,
    left: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 40,
    right: 20,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 40,
    left: 20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 40,
    right: 20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  content: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "60%",
    width: "80%",
  },
  logoContainer: {
    alignItems: "center",
  },
  icon: {
    marginBottom: 16,
    textShadowColor: "#00F0FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2.5,
  },
  subtitle: {
    fontSize: 8,
    color: "#5F758C",
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 6,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  loaderBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    fontSize: 8,
    color: "#FFE600",
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    marginBottom: 10,
  },
  spinner: {
    transform: [{ scale: 0.9 }],
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#4F5A6B",
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
});