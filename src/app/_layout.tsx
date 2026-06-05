import { Stack } from "expo-router";

export default function RootLayout() {
  return(
  <Stack screenOptions={{headerShown:false}}>
    <Stack.Screen name="SplashScreen"></Stack.Screen>
    <Stack.Screen name="(tabs)"></Stack.Screen>
  </Stack>
)}
