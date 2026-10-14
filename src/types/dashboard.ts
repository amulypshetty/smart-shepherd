export type NavigationTab = 'overview' | 'map' | 'counting' | 'alerts' | 'history';

export type SheepStatus = 'safe' | 'outside_zone' | 'no_signal';

export interface Sheep {
  id: string; // e.g. "#12"
  number: number;
  name?: string;
  tagId: string;
  collarId: string;
  status: SheepStatus;
  locationName: string;
  lat: number;
  lng: number;
  mapX: number; // percentage on map (0 - 100)
  mapY: number; // percentage on map (0 - 100)
  lastSeen: string;
  batteryPercent: number;
  signalStrengthDbm: number; // e.g. -68 dBm
  speedKmh: number;
  heartRateBpm: number;
  temperatureC: number;
  ageMonths: number;
  breed: string;
  inDangerZone?: boolean;
}

export type AlertSeverity = 'high' | 'medium' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface FlockAlert {
  id: string;
  sheepId?: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  severity: AlertSeverity;
  status: AlertStatus;
  location?: string;
  coordinates?: { lat: number; lng: number };
  actionTaken?: string;
}

export interface HourlyFlockCount {
  timeLabel: string;
  hour: number;
  detected: number;
  expected: number;
  missing: number;
}

export interface AIDetectionItem {
  id: string;
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [x, y, width, height] as percentage (0-100)
}

export interface AICountResult {
  imageUrl: string;
  imageName: string;
  detectedCount: number;
  expectedCount: number;
  confidencePercent: number;
  timestamp: string;
  inferenceTimeMs: number;
  detections: AIDetectionItem[];
  modelName: string;
}

export interface GrazingSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  pastureName: string;
  averageCount: number;
  safetyScorePercent: number;
  alertsTriggered: number;
  weatherSummary: string;
}
