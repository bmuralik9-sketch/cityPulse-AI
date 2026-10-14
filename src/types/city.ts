export type UserRole = 'citizen' | 'operator' | 'responder';

export type Language = 'en' | 'hi' | 'te';

export type HeatmapMode = 'traffic' | 'energy' | 'pollution' | 'waste' | 'safety' | 'none';

export type CameraViewMode = 'orbit' | 'topDown' | 'isometric' | 'focus' | 'satellite';

export type MapStyleMode = 'satellite' | 'night';

export interface ZoneData {
  id: string;
  name: string;
  code: string;
  status: 'optimal' | 'warning' | 'critical';
  center: [number, number, number];
  trafficCongestion: number; // 0 - 100%
  energyLoad: number; // in MW
  energyPeakWarning: boolean;
  wasteFillAverage: number; // 0 - 100%
  aqi: number; // AQI value
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  safetyScore: number; // 0 - 100
  activeIncidentsCount: number;
  description: string;
  cameraFeedUrl?: string;
  recommendedAction?: string;
}

export interface CityTelemetry {
  timestamp: string;
  overallCongestion: number; // %
  totalEnergyDemandMW: number; // MW
  renewableEnergyPercent: number; // %
  wasteBinOverflowCount: number;
  avgCityAqi: number;
  activeIncidents: number;
  co2SavedTodayKg: number;
  zones: ZoneData[];
}

export interface PredictiveAlert {
  id: string;
  category: 'traffic' | 'energy' | 'waste' | 'weather';
  title: string;
  predictedTimeframe: string; // e.g. "Next 45 mins", "Next 2 hours"
  probabilityScore: number; // 0 - 100%
  severity: 'low' | 'medium' | 'high' | 'critical';
  zoneId: string;
  zoneName: string;
  plainLanguageExplanation: string;
  recommendedAutomatedAction: string;
  actionExecuted: boolean;
}

export interface EmergencyIncident {
  id: string;
  type: 'Fire Outbreak' | 'Multi-Vehicle Collision' | 'Flash Flood' | 'Substation Electrical Failure';
  zoneId: string;
  locationName: string;
  severity: 'high' | 'critical';
  timeReported: string;
  status: 'detected' | 'triaged' | 'dispatched' | 'contained';
  recommendedResponders: {
    unitType: 'Fire & Rescue' | 'Rapid Paramedics' | 'Traffic Police' | 'Grid Emergency Team';
    nearestStation: string;
    estimatedEtaMinutes: number;
  }[];
  clearanceRoute: string;
  advisoryMessage: {
    en: string;
    hi: string;
    te: string;
  };
}

export interface CitizenReport {
  id: string;
  trackingNumber: string;
  title: string;
  category: 'Pothole' | 'Overflowing Waste' | 'Broken Streetlight' | 'Water Main Leak' | 'Hazardous Tree';
  imageUrl: string;
  location: string;
  zoneId: string;
  status: 'Submitted' | 'AI Triaged' | 'Assigned' | 'Crew Dispatched' | 'Resolved';
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedDepartment: string;
  aiAnalysisSummary: string;
  citizenReplyDraft: string;
}

export interface WasteTruckRoute {
  id: string;
  truckId: string;
  driverName: string;
  status: 'idle' | 'en_route' | 'completed';
  stopsCount: number;
  highPriorityBins: number;
  totalEstimatedKg: number;
  fuelSavedLiters: number;
  estimatedMinutes: number;
  coordinatesPath: [number, number, number][];
}

export interface EnergyOptimizationPlan {
  id: string;
  title: string;
  streetlightDimmingPercent: number;
  hvacLoadShiftMW: number;
  batteryDischargeMW: number;
  estimatedSavingsKwh: number;
  estimatedCo2ReductionKg: number;
  status: 'pending' | 'applied';
}
