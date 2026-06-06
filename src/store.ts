import { create } from "zustand";
import { DeviceMotion } from "expo-sensors";
import { aggressiveSteeringMovementEvent, EMA, excessiveDeviceMovementEvent, harshAccelerationEvent, harshBreakingEventDetection, IDeviceTelemetryData, phoneUseDuringDrivingEvent, sharpTurnEvent } from "./engine";
import * as SQLite from 'expo-sqlite';

export type Events = "HarshBreaking" | 
"HarshAcceleration" | 
"SharpTurn" | 
"AggressiveSteeringMovement" |
"ExcessiveDeviceMovement" |
"PhoneUseDuringDriving" 




export interface IStore{
    subscription:null | {remove:()=>void},
    data:IDeviceTelemetryData | null ,
    prevData:IDeviceTelemetryData|null,
    available:boolean,
    score:number,
    buffer:IDeviceTelemetryData[] | null,
    events :Events[] ,
    activeEvents: Events[],
    totalEventsInCurrentSession:number,
    eventHistory: {
        event: Events;
        timestamp: number;
    }[],
    eventStats: {
        HarshBreaking: number;
        HarshAcceleration: number;
        SharpTurn: number;
        AggressiveSteeringMovement: number;
        ExcessiveDeviceMovement: number;
        PhoneUseDuringDriving: number;
    },
    eventScoreImpactMap:{
        HarshBreaking: number;
        HarshAcceleration: number;
        SharpTurn: number;
        AggressiveSteeringMovement: number;
        ExcessiveDeviceMovement: number;
        PhoneUseDuringDriving: number;
    },
    startTime: number | null,
    endTime: number | null,
    db:null | SQLite.SQLiteDatabase,
    sessionId: number | null,
    createSession: () => void,
    clearSession: () => void,
    updateStartTime: (time: number) => void,
    updateEndTime: (time: number) => void,
    clearStartTime: () => void,
    clearEndTime: () => void,
    addToBuffer:(cur:IDeviceTelemetryData )=>void,
    eventDetection:()=>void,
    pointDeduction:()=>void,
    startEngine:()=>void,
    stopEngine:()=>void,
    addEventToHistory: (event: Events) => void,
    updateEventStats:(event:Events)=>void,
    openDB:()=>void,
    createTable:()=>void,
    insertIntoSessionTable: (sessionId: number, startTime: number, endTime: number, score: number) => Promise<void>,
    insertIntoEventsTable: (sessionId: number, eventType: string, timestamp: number, scoreImpact: number) => Promise<void>,
    getAllEventData: (eventName: string) => Promise<any[]>,
    getAllSessionData: () => Promise<any[]>,
}


const useStore = create<IStore>((set, get) => ({
    subscription: null,
    data: null,
    prevData:null,
    available: true,
    score:100,
    buffer:null,
    events:[],
    activeEvents: [],   
    totalEventsInCurrentSession:0,
    eventHistory:[],
    eventStats:{
        HarshBreaking: 0,
        HarshAcceleration: 0,
        SharpTurn: 0,
        AggressiveSteeringMovement: 0,
        ExcessiveDeviceMovement: 0,
        PhoneUseDuringDriving: 0,
    },
    eventScoreImpactMap:{
        "HarshBreaking": -5,
        "HarshAcceleration": -5,
        "SharpTurn": -4,
        "AggressiveSteeringMovement": -6,
        "ExcessiveDeviceMovement": -3,
        "PhoneUseDuringDriving": -10,
    },
    startTime: null,
    endTime: null,

    db:null,
    sessionId:null,

    createSession:()=>{
        const id = Date.now();
        set({sessionId:id})
    },

    clearSession:()=>{
        set({sessionId:null})
    },

    updateStartTime:(time:number)=>{
        set({startTime:time})
    },
    updateEndTime:(time:number)=>{
        set({endTime:time})
    },
    clearStartTime:()=>{
        set({startTime:null})
    },
    clearEndTime:()=>{
        set({endTime:null})
    },
    
    startEngine: async () => {
        console.log("engine")
        const isAvailable = await DeviceMotion.isAvailableAsync();
        set({available: isAvailable});
        if (!isAvailable) return;
        DeviceMotion.setUpdateInterval(100);

        set({eventStats:{ 
            HarshBreaking: 0,
            HarshAcceleration: 0,
            SharpTurn: 0,
            AggressiveSteeringMovement: 0,
            ExcessiveDeviceMovement: 0,
            PhoneUseDuringDriving: 0}
        })
        set({eventHistory:[]})
        const subscription = DeviceMotion.addListener((data) => {
            // console.log(data)
            set({ data:data as IDeviceTelemetryData});
            get().addToBuffer(data as IDeviceTelemetryData)
            get().eventDetection()
            get().pointDeduction()
        });



        set({subscription});
        set({startTime:Date.now()})
        get().createSession();
    },

    stopEngine: () => {
        const subscription = get().subscription;
        if (subscription) {
            subscription.remove();
            set({endTime:Date.now()})
            const sessionId = get().sessionId;
            const startTime = get().startTime;
            const endTime = get().endTime;
            const score = get().score;
            if (sessionId !== null && startTime !== null && endTime !== null) {
                get().insertIntoSessionTable(sessionId, startTime, endTime, score);
                
                const eventHistory = get().eventHistory;
                const eventScoreImpactMap = get().eventScoreImpactMap;
                eventHistory.forEach((event) => {
                    console.log(`data inserted ${sessionId} ${event.event} ${event.timestamp}`)
                    get().insertIntoEventsTable(sessionId, event.event, event.timestamp, eventScoreImpactMap[event.event]);
                });
            }
            
            set({subscription: null});
            set({data:null})
            set({prevData:null})
            set({sessionId:null})
            set({score:100})
            set({buffer:null})
            set({events:[]})
            set({totalEventsInCurrentSession:0})
        }
    },

    addToBuffer:(cur:IDeviceTelemetryData)=>{
         if (!cur.acceleration || !cur.rotationRate) {
            return;
        }

        if(!get().prevData){
            // console.log("SETTING PREV", JSON.stringify(cur, null, 2));
            set({prevData:cur})
            if(get().buffer==null){
                set({buffer:[]})
               set((state) => ({buffer: [...(state.buffer ?? []), cur]}));
            }
            return;
        }
        const prev = get().prevData;
        if(prev != null){
            // console.log("cur", cur);
            // console.log("prev", prev);
            // console.log("HERE 1");
            // console.log(cur.acceleration);
            // console.log(prev.acceleration);
            let x = EMA(cur.acceleration.x,prev.acceleration.x)
            // console.log("HERE 2");
            let y = EMA(cur.acceleration.y,prev.acceleration.y)
            let z = EMA(cur.acceleration.z,prev.acceleration.z)
            let alpha = EMA(cur.rotationRate.alpha,prev.rotationRate.alpha,0.25)
            let beta = EMA(cur.rotationRate.beta,prev.rotationRate.beta,0.25)
            let gamma = EMA(cur.rotationRate.gamma,prev.rotationRate.gamma,0.25)
            const processedData: IDeviceTelemetryData = {
                ...cur,
                acceleration: {
                    ...cur.acceleration,
                    x,
                    y,
                    z
                },
                rotationRate: {
                    ...cur.rotationRate,
                    alpha,
                    beta,
                    gamma
                }
            };
            // console.log(processedData)
            set({prevData: processedData});
            // console.log(get().prevData)
            const buffer = get().buffer;
            if(buffer && buffer.length >= 50){
                let newBuffer = [...buffer];
                newBuffer.shift();
                newBuffer.push(processedData);
                set({buffer:newBuffer});
            } else {
                set((state)=>({
                    buffer:[...(state.buffer ?? []), processedData]
                }));
            }
        }
    },


    eventDetection:()=>{
        let buffer = get().buffer;
        let harshBreaking = false;
        let harshAcceleration = false;
        let sharpTurn = false;
        let aggressiveSteeringMovement = false;
        let excessiveDeviceMovement = false;
        let phoneUseDuringDriving = false;
        let events :Events[] = []
        if(buffer != null){
            if(harshBreakingEventDetection(buffer)){
                harshBreaking = true;
                events.push("HarshBreaking")
                
            }
            if(harshAccelerationEvent(buffer)){
                harshAcceleration = true;
                events.push("HarshAcceleration")
            }
            if(sharpTurnEvent(buffer)){
                sharpTurn = true;
                events.push("SharpTurn");
            }
            if(aggressiveSteeringMovementEvent(buffer)){
                aggressiveSteeringMovement = true;
                events.push("AggressiveSteeringMovement");
            }
            if(excessiveDeviceMovementEvent(buffer)){
                excessiveDeviceMovement = true;
                events.push("ExcessiveDeviceMovement")
            }
            if(phoneUseDuringDrivingEvent(buffer)){
                phoneUseDuringDriving = true;
                events.push("PhoneUseDuringDriving")
            }
        }
      
        
        set({events:[...events]})
        const len = events.length
        set((state)=>({totalEventsInCurrentSession:state.totalEventsInCurrentSession+len}))
    },

    pointDeduction: () => {
        const events = get().events;
        const activeEvents = get().activeEvents;

        const newEvents = events.filter(
            event => !activeEvents.includes(event)
            
        );
        for (const event of newEvents) {
            get().addEventToHistory(event);
            get().updateEventStats(event);
        }

        let score = get().score;

        for (const event of newEvents) {
            if (event === "HarshBreaking") score -= 5;
            else if (event === "HarshAcceleration") score -= 5;
            else if (event === "SharpTurn") score -= 4;
            else if (event === "AggressiveSteeringMovement") score -= 6;
            else if (event === "ExcessiveDeviceMovement") score -= 3;
            else if (event === "PhoneUseDuringDriving") score -= 10;
        }

        set({
            score: Math.max(0, score),
            activeEvents: events
        });
    },

    addEventToHistory: (event) => {
        set((state) => ({
            eventHistory: [
                ...state.eventHistory,
                {
                    event,
                    timestamp: Date.now()
                }
            ]
        }))
    },

    updateEventStats: (event: Events) => {
        set((state) => ({
            eventStats: {
                ...state.eventStats,
                [event]: state.eventStats[event] + 1,
            },
        }));
    },

    openDB:()=>{
        set({db:SQLite.openDatabaseSync("drive_analyzer")})
    },

    createTable:()=>{
        const db = get().db;

        db?.execSync(`
            
            CREATE TABLE IF NOT EXISTS EVENTS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER,
                event_type TEXT,
                timestamp INTEGER,
                score_impact INTEGER
            );
            
            CREATE TABLE IF NOT EXISTS SESSIONS (
                id INTEGER PRIMARY KEY,
                start_time INTEGER,
                end_time INTEGER,
                score INTEGER
            );
            
            `)

    },

    insertIntoSessionTable:async (sessionId:number,startTime:number,endTime:number,score:number)=>{
        const db = get().db;
        if(!db){
            return;
        }
        await db.runAsync("INSERT INTO SESSIONS (id, start_time, end_time, score) VALUES (?, ?, ?, ?)", [sessionId, startTime, endTime, score]);

    },

    insertIntoEventsTable:async (sessionId:number,eventType:string,timestamp:number,scoreImpact:number)=>{
        const db = get().db;
        if(!db){
            return;
        }
        await db.runAsync("INSERT INTO EVENTS (session_id, event_type, timestamp, score_impact) VALUES (?, ?, ?, ?)", [sessionId, eventType, timestamp, scoreImpact]);
    },

    getAllEventData:async (eventName:string)=>{
        const db = get().db;
        if(!db){
            return [];
        }
        const result = await db.getAllAsync("SELECT * FROM EVENTS WHERE event_type = ?", [eventName]);
        return result;
    },

    getAllSessionData:async ()=>{
        const db = get().db;
        if(!db){
            return [];
        }
        const result = await db.getAllAsync("SELECT * FROM SESSIONS");
        return result;
    },



    




    


}));

export default useStore;