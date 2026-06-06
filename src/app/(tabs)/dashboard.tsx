import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, StatusBar, Platform, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import useStore from "@/store";
import { LineChart } from "react-native-gifted-charts";

// Cyberpunk Theme Colors
const CYBER_CYAN = "#00F0FF";
const CYBER_PINK = "#FF0055";
const CYBER_YELLOW = "#FFE600";
const CYBER_ORANGE = "#FF8C00";
const CYBER_BLUE = "#0066FF";
const CYBER_TEAL = "#00E5A3";
const MUTED_STEEL = "#4F5A6B";
const VOID_BG = "#020308";
const CARD_BG = "#09090F";

interface ChartDataPoint {
  value: number;
  label: string;
}

interface DashboardState {
  totalEvents: ChartDataPoint[];
  specificEvents: Record<string, ChartDataPoint[]>;
  sessionsCount: number;
}

type TimeFilter = "all" | "30d" | "7d" | "1d";

const Dashboard = () => {
  const isFocused = useIsFocused();
  const getAllSessionData = useStore((state) => state.getAllSessionData);
  const getAllEventData = useStore((state) => state.getAllEventData);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<DashboardState | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused, filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const sessions = await getAllSessionData();

      if (!sessions || sessions.length === 0) {
        setData(null);
        return;
      }

      // Sort sessions by start time ascending (chronological order)
      let sortedSessions = [...sessions].sort((a, b) => a.start_time - b.start_time);

      // Filter sessions based on selected timeframe
      const now = Date.now();
      if (filter === "30d") {
        sortedSessions = sortedSessions.filter((s) => s.start_time >= now - 30 * 24 * 3600 * 1000);
      } else if (filter === "7d") {
        sortedSessions = sortedSessions.filter((s) => s.start_time >= now - 7 * 24 * 3600 * 1000);
      } else if (filter === "1d") {
        sortedSessions = sortedSessions.filter((s) => s.start_time >= now - 24 * 3600 * 1000);
      }

      if (sortedSessions.length === 0) {
        setData({
          totalEvents: [],
          specificEvents: {
            HarshBreaking: [],
            HarshAcceleration: [],
            SharpTurn: [],
            AggressiveSteeringMovement: [],
            ExcessiveDeviceMovement: [],
            PhoneUseDuringDriving: [],
          },
          sessionsCount: 0,
        });
        return;
      }

      const eventTypes = [
        "HarshBreaking",
        "HarshAcceleration",
        "SharpTurn",
        "AggressiveSteeringMovement",
        "ExcessiveDeviceMovement",
        "PhoneUseDuringDriving",
      ];

      // Fetch events for each event type
      const eventsMap: Record<string, any[]> = {};
      for (const type of eventTypes) {
        eventsMap[type] = await getAllEventData(type);
      }

      const totalEventsList: ChartDataPoint[] = [];
      const specificEventsLists: Record<string, ChartDataPoint[]> = {
        HarshBreaking: [],
        HarshAcceleration: [],
        SharpTurn: [],
        AggressiveSteeringMovement: [],
        ExcessiveDeviceMovement: [],
        PhoneUseDuringDriving: [],
      };

      sortedSessions.forEach((session, index) => {
        // Label sessions sequentially as S01, S02, etc.
        const label = `S${String(index + 1).padStart(2, "0")}`;
        const sessionId = session.id;

        let totalEventsCount = 0;
        eventTypes.forEach((type) => {
          const eventsOfType = eventsMap[type] || [];
          const count = eventsOfType.filter((e) => String(e.session_id) === String(sessionId)).length;
          specificEventsLists[type].push({ value: count, label });
          totalEventsCount += count;
        });

        totalEventsList.push({ value: totalEventsCount, label });
      });

      setData({
        totalEvents: totalEventsList,
        specificEvents: specificEventsLists,
        sessionsCount: sortedSessions.length,
      });
    } catch (error) {
      console.error("[Dashboard] Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={VOID_BG} />
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="monitor-dashboard" size={16} color={CYBER_CYAN} style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>// ANALYTICS_DIAG_MATRIX</Text>
        </View>
        {data && data.sessionsCount > 0 && (
          <Text style={styles.headerMeta}>SESSIONS: {String(data.sessionsCount).padStart(3, "0")}</Text>
        )}
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow as any}>
        {(
          [
            { key: "all", label: "ALL TIME" },
            { key: "30d", label: "30 DAYS" },
            { key: "7d", label: "7 DAYS" },
            { key: "1d", label: "24 HOURS" },
          ] as const
        ).map((item) => {
          const isActive = filter === item.key;
          return (
            <Text
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[
                styles.filterButton as any,
                isActive ? styles.filterActive : styles.filterInactive,
              ]}
            >
              {item.label}
            </Text>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={CYBER_PINK} />
          <Text style={styles.loadingText}>[ RETRIEVING DIAGNOSTICS... ]</Text>
        </View>
      ) : !data || data.sessionsCount === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-areaspline-variant" size={48} color={CYBER_CYAN} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>[ NO MATRIX DATA ]</Text>
          <Text style={styles.emptySubtitle}>
            NO VEHICLE TELEMETRY SESSIONS WERE LOGGED IN THE SELECTED TIMEFRAME. RECORD A SYSTEM SESSION TO POPULATE.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Chart 1: Total Events */}
          <CyberChart
            title="Total Session Events"
            subtitle="Aggregate driving anomalies logged per session"
            data={data.totalEvents}
            color={CYBER_CYAN}
            gradientColor={CYBER_CYAN}
            icon="chart-bell-curve-cumulative"
          />

          {/* Chart 2: Harsh Breaking */}
          <CyberChart
            title="Harsh Braking Events"
            subtitle="Abrupt deceleration alerts logged"
            data={data.specificEvents.HarshBreaking}
            color={CYBER_YELLOW}
            gradientColor={CYBER_YELLOW}
            icon="car-brake-alert"
          />

          {/* Chart 3: Harsh Acceleration */}
          <CyberChart
            title="Harsh Acceleration Events"
            subtitle="Aggressive speed-ups logged"
            data={data.specificEvents.HarshAcceleration}
            color={CYBER_ORANGE}
            gradientColor={CYBER_ORANGE}
            icon="speedometer"
          />

          {/* Chart 4: Sharp Turn */}
          <CyberChart
            title="Sharp Turn Events"
            subtitle="High-G lateral acceleration corners"
            data={data.specificEvents.SharpTurn}
            color={CYBER_BLUE}
            gradientColor={CYBER_BLUE}
            icon="navigation-variant"
          />

          {/* Chart 5: Aggressive Steering */}
          <CyberChart
            title="Aggressive Steering"
            subtitle="Harsh sway and rapid alignment corrections"
            data={data.specificEvents.AggressiveSteeringMovement}
            color={CYBER_PINK}
            gradientColor={CYBER_PINK}
            icon="steering"
          />

          {/* Chart 6: Device Shaking */}
          <CyberChart
            title="Excessive Device Shakes"
            subtitle="Logged when phone mount is unstable"
            data={data.specificEvents.ExcessiveDeviceMovement}
            color={CYBER_TEAL}
            gradientColor={CYBER_TEAL}
            icon="vibrate"
          />

          {/* Chart 7: Phone Usage */}
          <CyberChart
            title="Phone Usage Incidents"
            subtitle="Screen interactions during transit"
            data={data.specificEvents.PhoneUseDuringDriving}
            color="#FF2424"
            gradientColor="#FF2424"
            icon="cellphone-remove"
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

interface CyberChartProps {
  title: string;
  subtitle: string;
  data: ChartDataPoint[];
  color: string;
  gradientColor: string;
  icon: string;
}

const CyberChart = ({ title, subtitle, data, color, gradientColor, icon }: CyberChartProps) => {
  const chartWidth = Dimensions.get("window").width - 82;

  // Compute key stats for the HUD stats footer
  const values = data.map((d) => d.value);
  const total = values.reduce((sum, v) => sum + v, 0);
  const avg = (total / (data.length || 1)).toFixed(1);
  const max = Math.max(...values, 0);

  // Dynamic integer scales to prevent fractional y-axis markers
  const chartMax = max === 0 ? 4 : Math.ceil(max / 4) * 4;
  const stepValue = chartMax / 4;

  return (
    <View style={[styles.chartCard, { borderColor: `${color}30` }]}>
      {/* Cyber Frame Ornaments */}
      <View style={[styles.cardCorner, styles.cardTopLeft, { borderColor: color }]} />
      <View style={[styles.cardCorner, styles.cardTopRight, { borderColor: color }]} />
      <View style={[styles.cardCorner, styles.cardBottomLeft, { borderColor: color }]} />
      <View style={[styles.cardCorner, styles.cardBottomRight, { borderColor: color }]} />

      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <MaterialCommunityIcons name={icon as any} size={13} color={color} style={{ marginRight: 6 }} />
          <Text style={[styles.cardTitle, { color }]}>{title.toUpperCase()}</Text>
        </View>
        <Text style={styles.cardSubtitle}>{subtitle.toUpperCase()}</Text>
      </View>

      {data.length === 0 ? (
        <View style={[styles.chartWrapper, { height: 125, justifyContent: "center" }]}>
          <Text style={{ color: MUTED_STEEL, fontSize: 8.5, fontFamily: "monospace", letterSpacing: 0.5 }}>
            [ NO DATA LOGGED FOR THIS PERIOD ]
          </Text>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <LineChart
            areaChart
            curved
            data={data}
            width={chartWidth}
            height={125}
            spacing={35}
            initialSpacing={18}
            endSpacing={18}
            scrollToEnd={true}
            backgroundColor="transparent"
            
            // Line details
            color={color}
            thickness={2.5}
            startFillColor={gradientColor}
            endFillColor="transparent"
            startOpacity={0.25}
            endOpacity={0.01}

            // Data points (hide by default, show on pointer select)
            hideDataPoints={true}

            // Grid lines
            rulesColor="#1f1f2e"
            rulesType="dashed"
            dashWidth={1.5}
            dashGap={4}

            // Axes (hide lines, show labels)
            xAxisColor={`${color}30`}
            yAxisColor={`${color}30`}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={styles.axisLabel as any}
            yAxisTextStyle={styles.axisLabel as any}
            
            // Custom Y-axis on the Left
            yAxisSide={0} // yAxisSides.LEFT

            // Pointer configuration matching reference image
            pointerConfig={{
              activatePointersOnLongPress: true,
              pointerStripUptoDataPoint: true,
              pointerStripColor: "#FFFFFF80",
              pointerStripWidth: 1.2,
              strokeDashArray: [2, 4], // dotted vertical line
              pointerColor: "#FFFFFF",
              radius: 4,
              pointerComponent: () => (
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#FFFFFF",
                  borderWidth: 2,
                  borderColor: color,
                  shadowColor: "#FFFFFF",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                }} />
              ),
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={{
                    justifyContent: 'center',
                    marginTop: 35,
                    marginLeft: 10,
                  }}>
                    <Text style={{
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                      fontWeight: '900',
                      textShadowColor: '#000000',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {items[0].value} PTS
                    </Text>
                  </View>
                );
              }
            }}

            // Custom integer ranges
            maxValue={chartMax}
            stepValue={stepValue}
            noOfSections={4}
            yAxisLabelContainerStyle={{ width: 22, marginLeft: -8 }}
          />
        </View>
      )}

      {/* Cyber readout stats footer */}
      <View style={styles.cardFooter as any}>
        <View style={styles.statBox as any}>
          <Text style={styles.statLabel as any}>SUM_T</Text>
          <Text style={[styles.statValue as any, { color }]}>{total.toString().padStart(3, "0")}</Text>
        </View>
        <View style={styles.verticalDivider as any} />
        <View style={styles.statBox as any}>
          <Text style={styles.statLabel as any}>AVG_S</Text>
          <Text style={[styles.statValue as any, { color }]}>{avg}</Text>
        </View>
        <View style={styles.verticalDivider as any} />
        <View style={styles.statBox as any}>
          <Text style={styles.statLabel as any}>PEAK_M</Text>
          <Text style={[styles.statValue as any, { color }]}>{max.toString().padStart(2, "0")}</Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: VOID_BG,
    position: "relative",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    borderWidth: 1,
    borderColor: CYBER_CYAN,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: VOID_BG,
  },
  loadingText: {
    marginTop: 16,
    color: CYBER_PINK,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1b26",
    backgroundColor: "#030408",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  headerMeta: {
    color: CYBER_CYAN,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#030408",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#161622",
    flexWrap: "wrap",
    gap: 6,
  },
  filterButton: {
    fontSize: 7.5,
    fontWeight: "900",
    letterSpacing: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  filterActive: {
    backgroundColor: "#00F0FF12",
    borderColor: CYBER_CYAN,
    color: CYBER_CYAN,
  },
  filterInactive: {
    backgroundColor: "#09090F",
    borderColor: "#161622",
    color: MUTED_STEEL,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  chartCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    position: "relative",
    overflow: "hidden",
  },
  cardCorner: {
    position: "absolute",
    width: 8,
    height: 8,
  },
  cardTopLeft: {
    top: -1,
    left: -1,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  cardTopRight: {
    top: -1,
    right: -1,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  cardBottomLeft: {
    bottom: -1,
    left: -1,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  cardBottomRight: {
    bottom: -1,
    right: -1,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  cardHeader: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#161622",
    paddingBottom: 6,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  cardSubtitle: {
    fontSize: 7.5,
    color: MUTED_STEEL,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  axisLabel: {
    color: MUTED_STEEL,
    fontSize: 7.5,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontWeight: "800",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#161622",
    paddingTop: 8,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 7,
    color: MUTED_STEEL,
    fontWeight: "900",
    letterSpacing: 1,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  statValue: {
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  verticalDivider: {
    width: 0.5,
    height: 14,
    backgroundColor: "#161622",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  emptyIcon: {
    textShadowColor: CYBER_CYAN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "900",
    color: CYBER_CYAN,
    letterSpacing: 2.5,
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  emptySubtitle: {
    color: MUTED_STEEL,
    fontSize: 8,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.8,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 14,
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
});