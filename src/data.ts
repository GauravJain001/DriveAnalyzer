import * as SQLite from 'expo-sqlite';

/**
 * Seeds the local SQLite database with realistic mock driving sessions and events.
 * Inserts at least 60 mock records into both SESSIONS and EVENTS tables.
 * Uses timestamps (integers) as session IDs.
 *
 * @param db The open SQLite database instance
 */
export async function seedDummyData(db: SQLite.SQLiteDatabase): Promise<void> {
  // Check if tables already have data to avoid duplicate seeding
  try {
    const existingSessions = await db.getAllAsync<{ id: any }>("SELECT id FROM SESSIONS LIMIT 1");
    if (existingSessions.length > 0) {
      console.log("[Seeder] Database already populated with session records. Skipping seeding.");
      return;
    }
  } catch (e) {
    // Table doesn't exist, we will create it below
  }

  console.log("[Seeder] Database is empty. Recreating tables and seeding dummy telemetry data...");

  // Drop tables to clean up old schemas and recreate them with INTEGER keys
  await db.execAsync(`
    DROP TABLE IF EXISTS EVENTS;
    DROP TABLE IF EXISTS SESSIONS;
    
    CREATE TABLE IF NOT EXISTS SESSIONS (
        id INTEGER PRIMARY KEY,
        start_time INTEGER,
        end_time INTEGER,
        score INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS EVENTS (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER,
        event_type TEXT,
        timestamp INTEGER,
        score_impact INTEGER,
        FOREIGN KEY(session_id) REFERENCES SESSIONS(id)
    );
  `);

  // Available event types and their specific score impact penalties defined in store
  const eventTypes = [
    { type: "HarshBreaking", impact: -5 },
    { type: "HarshAcceleration", impact: -5 },
    { type: "SharpTurn", impact: -4 },
    { type: "AggressiveSteeringMovement", impact: -6 },
    { type: "ExcessiveDeviceMovement", impact: -3 },
    { type: "PhoneUseDuringDriving", impact: -10 },
  ];

  const sessionsCount = 65; // Ensures at least 60 sessions
  const now = Date.now();

  for (let i = 0; i < sessionsCount; i++) {
    // Space driving sessions out by 6 hours sequentially back in time
    const startTime = now - (sessionsCount - i) * 6 * 3600 * 1000 + Math.floor(Math.random() * 3600 * 1000);
    // Session duration ranges from 15 to 120 minutes
    const duration = (15 + Math.floor(Math.random() * 105)) * 60 * 1000;
    const endTime = startTime + duration;

    // Use the session start_time timestamp (integer) as the session ID
    const sessionId = startTime;

    // To guarantee at least 60 events across the dataset, ensure the first 60 sessions
    // have at least 1-3 events. The rest of the sessions can have 0-3 events.
    const numEvents = i < 60 ? 1 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4);
    
    let score = 100;
    const eventsToInsert: { type: string; timestamp: number; impact: number }[] = [];

    for (let j = 0; j < numEvents; j++) {
      const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const eventTime = startTime + Math.floor(Math.random() * duration);
      eventsToInsert.push({
        type: event.type,
        timestamp: eventTime,
        impact: event.impact,
      });
      score += event.impact;
    }

    // Scores cannot fall below 0
    score = Math.max(0, score);

    // 1. Insert session record
    await db.runAsync(
      "INSERT INTO SESSIONS (id, start_time, end_time, score) VALUES (?, ?, ?, ?)",
      [sessionId, startTime, endTime, score]
    );

    // 2. Insert event records for this session
    for (const evt of eventsToInsert) {
      await db.runAsync(
        "INSERT INTO EVENTS (session_id, event_type, timestamp, score_impact) VALUES (?, ?, ?, ?)",
        [sessionId, evt.type, evt.timestamp, evt.impact]
      );
    }
  }

  console.log(`[Seeder] Seeding completed successfully. Seeded ${sessionsCount} sessions and events.`);
}
